"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = void 0;

var _uuid = require("uuid");

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _commonMiddleware = _interopRequireDefault(require("../lib/commonMiddleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var dynamodb = new _awsSdk["default"].DynamoDB.DocumentClient();

function createAuction(event, context) {
  var title, now, auction;
  return regeneratorRuntime.async(function createAuction$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          title = event.body.title;
          now = new Date();
          auction = {
            id: (0, _uuid.v4)(),
            title: title,
            status: 'OPEN',
            highestBid: {
              amount: 0
            },
            created_at: now.toISOString()
          };
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(dynamodb.put({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Item: auction
          }).promise());

        case 6:
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](3);
          console.log(_context.t0);
          throw new _httpErrors["default"].InternalServerError(_context.t0);

        case 12:
          return _context.abrupt("return", {
            statusCode: 201,
            body: JSON.stringify(auction)
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 8]]);
} // httpJsonBodyParser parses stringied event body, exactly what JSON.parse does


var handler = (0, _commonMiddleware["default"])(createAuction);
exports.handler = handler;