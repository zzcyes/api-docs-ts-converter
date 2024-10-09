const { writeFileText } = require("./utils");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator");
const t = require("@babel/types");
const path = require("path");

const fs = require("fs");

const parse = parser.parse;
const generate = generator.default;

// console.log(traverse);
// console.log(generate);
// console.log(_t);

const rawCode = fs.readFileSync(path.join(__dirname, "../src/index.ts"), {
  encoding: "utf-8",
});

const ast = parse(rawCode, {
  sourceType: "unambiguous",
  plugins: ["typescript"],
});

// console.log(ast.program.body);

writeFileText(path.join(__dirname, "ast.json"), JSON.stringify(ast, null, 4));

const docsList = [];

// const baseObj = {
//     name: null,
//     url: null,
//     methods: null,
//     params: null,
//     remark: null,
// };
// .typeName.name

const getTsParams = (params) => {
  if (params.typeAnnotation) {
    if (params.typeAnnotation.typeName) {
      return params.typeAnnotation.typeName.name;
    } else {
      return getTsParams(params.typeAnnotation);
    }
  } else if (params.typeName) {
    return params.typeName;
  } else {
    return params;
  }
};
const getNormalParams = (params) => {
  return params.name;
};

const getParamsTypeName = (params) => {
  if (params.name === "payload") {
    return getTsParams(params);
  }
  return getNormalParams(params);
};

const getTempUrl = (args) => {
  let url = "";
  args.quasis.forEach((u) => {
    url += u.value.raw;
  });
  url += args.expressions[0].name;
  return url;
};

const getUrl = (args) => {
  if (args.type === "TemplateLiteral") {
    return getTempUrl(args);
  } else {
    return args.value;
  }
  // item.value.body.callee.object.arguments[0].value
};

const tsInterfaceList = [];

const getReturnType = (node) => {
  console.debug(node);
  if (node.typeParameters && node.typeParameters.params[0]) {
    const typeParam = node.typeParameters.params[0];
    if (typeParam.type === "TSTypeReference") {
      let typeName = typeParam.typeName.name;
      if (typeParam.typeParameters && typeParam.typeParameters.params[0]) {
        const innerType = typeParam.typeParameters.params[0];
        if (innerType.type === "TSTypeReference") {
          typeName += `<${innerType.typeName.name}>`;
        } else if (innerType.type === "TSLiteralType") {
          typeName += `<${innerType.literal.value}>`;
        }
      }
      return typeName;
    }
  }
  return null;
};

traverse(ast, {
  ClassBody(p) {
    p.node.body.forEach((item) => {
      let returnType = null;
      if (item.value && item.value.body && item.value.body.callee) {
        const callExpression = item.value.body.callee.object;
        if (callExpression && callExpression.callee) {
          returnType = getReturnType(callExpression);
        }
      }

      const baseObj = {
        name: item.key.name,
        url: getUrl(item.value.body.callee.object.arguments[0]),
        methods: item.value.body.callee.object.callee.property.name,
        params: item.value.params.map((x) => {
          return getParamsTypeName(x);
        }),
        remark: null,
        returnType: returnType,
      };
      docsList.push(baseObj);
    });
  },
  TSInterfaceDeclaration(p) {
    if (p.node.id.name === "IGetUserListPayload") {
      const { body } = p.node.body;
      const params = body.map((b) => {
        return {
          key: b.key.name,
          comments: b.trailingComments[0].value,
          type: b.typeAnnotation.typeAnnotation
            ? b.typeAnnotation.typeAnnotation.type
            : b.typeAnnotation.type,
        };
      });
      tsInterfaceList.push(params);
    }
  },
  // ClassDeclaration(p) {
  //     const node = p.node;
  //     console.log(node);
  //     // let copyNode = t.cloneNode(node); //复制当前节点
  //     // traverse(copyNode, {}, {}, p); // 对子树进行遍历和替换，不影响当前的path
  // },
  // FunctionDeclaration(path) {
  //     const node = path.node;
  //     let copyNode = t.cloneNode(node); //复制当前节点
  //     traverse(copyNode, {}, {}, path); // 对子树进行遍历和替换，不影响当前的path
  // },
});
console.log(docsList);
console.log(tsInterfaceList);

writeFileText(
  path.resolve(__dirname, "./docsList.json"),
  JSON.stringify(docsList, null, 4)
);

// const output = generate(ast, {});

// writeFileText('babel/output.ts', output.code);
