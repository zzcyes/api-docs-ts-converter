const jsonDoc = require("./docsList.json");
const fs = require("fs");
const path = require("path");

const generateApiClass = (docs) => {
  const className = "UserApiClass";
  const methods = docs.map((doc) => {
    let params = doc.params
      .map((param) => {
        if (param.includes("Payload")) {
          return `payload: ${param}`;
        }
        return `${param}: any`;
      })
      .join(", ");
    let returnType = doc.returnType || "any";
    let methodParams = "";
    let url = doc.url;

    if (doc.methods === "get" || doc.methods === "delete") {
      if (doc.params.length > 1) {
        url = url.replace(
          "?age=id",
          `\${${doc.params[0]}}?age=\${${doc.params[1]}}`
        );
        methodParams = "";
      } else {
        methodParams = "{ params: payload }";
      }
    } else {
      methodParams = "payload";
    }

    return `
  ${doc.name} = (${params}) =>
    request
      .${doc.methods}<${returnType}>("${url}"${
      methodParams ? ", " + methodParams : ""
    })
      .then((res) => res.data)`;
  });

  return `
class ${className} {
${methods.join("\n")}
}

export const UserApi = new ${className}();
`;
};

const apiClass = generateApiClass(jsonDoc);

// 将生成的API类输出到控制台
console.log(apiClass);

// 将生成的API类写入文件
fs.writeFileSync(path.resolve(__dirname, "generatedApi.ts"), apiClass);
