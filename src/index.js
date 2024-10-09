"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserApi = void 0;
var _axios = _interopRequireDefault(require("axios"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var timeout = 20000;
var LOGOUT_EVENT = "LOGOUT_EVENT";
//加个防抖，防止弹很多个认真过期的message
var triggerLogOut = function triggerLogOut() {
  var logOutEvent = new Event(LOGOUT_EVENT);
  window.dispatchEvent(logOutEvent);
};
var SuccessStatusCodeInterceptor = function SuccessStatusCodeInterceptor(response) {
  var data = response.data;
  var businessStatus = data.status;
  if (businessStatus) {
    //这里是业务状态码错误的请求逻辑，一般来说我们
    if (businessStatus !== 200) {
      //业务错误时，将后台的msg当做错误信息，供前端进行展示
      return Promise.reject(new Error(data.msg));
    } else {
      //业务正确时，正常返回
      return response;
    }
  }
  //没有业务状态码，但http状态码为2xx的时候正常返回
  return response;
};
var FailStatusCodeInterceptor = function FailStatusCodeInterceptor(error) {
  if (error.response) {
    console.log("respoonse error in response interceptor", error);
    var status = error.response.status;
    if (status === 401) {
      triggerLogOut();
    }
  }
  return Promise.reject(error);
};
var request = _axios["default"].create({
  timeout: timeout,
  withCredentials: true
});
request.interceptors.response.use(SuccessStatusCodeInterceptor, FailStatusCodeInterceptor);

//用作对象返回
var UserApiClass = /*#__PURE__*/_createClass(function UserApiClass() {
  _classCallCheck(this, UserApiClass);
  _defineProperty(this, "getUserList", function (payload) {
    return request.post("/iapp/user/page", payload).then(function (res) {
      return res.data;
    });
  });
  _defineProperty(this, "createUser", function (payload) {
    return request.post("/iapp/user/save", payload).then(function (res) {
      return res.data;
    });
  });
  _defineProperty(this, "modifyUser", function (payload) {
    return request.put("/iapp/user/modify", payload).then(function (res) {
      return res.data;
    });
  });
  _defineProperty(this, "deleteUserById", function (id, age) {
    return request["delete"]("/iapp/user/".concat(id, "?age=").concat(age)).then(function (res) {
      return res.data;
    });
  });
});
var UserApi = exports.UserApi = new UserApiClass();