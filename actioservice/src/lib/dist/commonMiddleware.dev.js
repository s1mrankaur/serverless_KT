"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = _interopRequireDefault(require("@middy/core"));

var _httpJsonBodyParser = _interopRequireDefault(require("@middy/http-json-body-parser"));

var _httpEventNormalizer = _interopRequireDefault(require("@middy/http-event-normalizer"));

var _httpErrorHandler = _interopRequireDefault(require("@middy/http-error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(handler) {
  return (0, _core["default"])(handler).use([(0, _httpJsonBodyParser["default"])(), (0, _httpEventNormalizer["default"])(), (0, _httpErrorHandler["default"])()]);
};

exports["default"] = _default;