"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = void 0;

var _awsSdk = _interopRequireWildcard(require("aws-sdk"));

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _commonMiddleware = _interopRequireDefault(require("../lib/commonMiddleware"));

var _getAuction = require("./getAuction");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var dynamodb = new _awsSdk["default"].DynamoDB.DocumentClient();

function placeBid(event, context) {
  var id, amount, auction, params, updatedAuction, result;
  return regeneratorRuntime.async(function placeBid$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = event.pathParameters.id;
          amount = event.body.amount;
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _getAuction.getAuctionById)(id));

        case 4:
          auction = _context.sent;

          if (!(amount <= auction.highestBid.amount)) {
            _context.next = 7;
            break;
          }

          throw new _httpErrors["default"].Forbidden("Your bid must be higher than ".concat(auction.highestBid.amount, "!"));

        case 7:
          params = {
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: {
              id: id
            },
            UpdateExpression: 'set highestBid.amount = :amount',
            ExpressionAttributeValues: {
              ':amount': amount
            },
            ReturnValues: 'ALL_NEW'
          };
          _context.prev = 8;
          _context.next = 11;
          return regeneratorRuntime.awrap(dynamodb.update(params).promise());

        case 11:
          result = _context.sent;
          updatedAuction = result.Attributes;
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](8);
          console.error(_context.t0);
          throw new _httpErrors["default"].InternalServerError(_context.t0);

        case 19:
          ;
          return _context.abrupt("return", {
            statusCode: 200,
            body: JSON.stringify(updatedAuction)
          });

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[8, 15]]);
}

var handler = (0, _commonMiddleware["default"])(placeBid);
exports.handler = handler;