import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

import { apiResponse } from '../lib/apiResponse';

const db = require('../lib/models')

const client = new DynamoDBClient({ region: "eu-west-1" });
const command = new ScanCommand({TableName: process.env.DYNAMODB_TABLE});

module.exports.handler = async function stats(event, context) {
  const result = await client.send(command);
  const body = { result: result.Items };
  return apiResponse(body)

}