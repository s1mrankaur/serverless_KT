import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = event.body;
  const now = new Date();
  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    highestBid: {
      amount: 0,
    },
    created_at: now.toISOString()
  };

  try{
    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    }).promise();
  }catch(error){
    console.log(error);
    throw new createError.InternalServerError(error); //to create errors in a declarative way, instead of havin gto create objects
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

 // httpJsonBodyParser parses stringied event body, exactly what JSON.parse does
export const handler = commonMiddleware(createAuction);

