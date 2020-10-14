"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAuctionById = getAuctionById;
exports.handler = void 0;

var _awsSdk = _interopRequireWildcard(require("aws-sdk"));

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _commonMiddleware = _interopRequireDefault(require("../lib/commonMiddleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var dynamodb = new _awsSdk["default"].DynamoDB.DocumentClient();

function getAuctionById(id) {
  var auction, result;
  return regeneratorRuntime.async(function getAuctionById$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(dynamodb.get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: {
              id: id
            }
          }).promise());

        case 3:
          result = _context.sent;
          auction = result.Item;
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          throw new _httpErrors["default"].InternalServerError(_context.t0);

        case 11:
          if (auction) {
            _context.next = 13;
            break;
          }

          throw new _httpErrors["default"].NotFound("Auction with Id \"".concat(id, "\" not found"));

        case 13:
          return _context.abrupt("return", auction);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}

function getAuction(event, context) {
  var id, auction;
  return regeneratorRuntime.async(function getAuction$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = event.pathParameters.id;
          _context2.next = 3;
          return regeneratorRuntime.awrap(getAuctionById(id));

        case 3:
          auction = _context2.sent;
          return _context2.abrupt("return", {
            statusCode: 200,
            body: JSON.stringify(auction)
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}

var handler = (0, _commonMiddleware["default"])(getAuction);
exports.handler = handler;