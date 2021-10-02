import { APIGatewayEvent, Context, Handler } from 'aws-lambda';

import { getMongoose } from '../models';

interface IQueryString {
  page: number
  limit: number
}

const handler: Handler = async function getMatches(event: APIGatewayEvent, context: Context) {
  let { page, limit } = event.queryStringParameters as unknown as IQueryString

  if (!page) {
    page = 1
  }

  if (!limit) {
    limit = 10
  }

  const { Match } = await getMongoose();
  const matches = await Match.paginate({}, { page, limit });
  const body = { matches };

  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(body),
    isBase64Encoded: false
  }

}

module.exports.handler = handler;