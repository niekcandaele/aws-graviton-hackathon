import { APIGatewayEvent, Context, Handler } from 'aws-lambda';

import { apiResponse } from '../lib/apiResponse';
import { getMongoose } from '../models';

interface IQueryString {
  page: number
  limit: number
}

const handler: Handler = async function getMatches(event: APIGatewayEvent, context: Context) {
  const qs = event.queryStringParameters as unknown as IQueryString;

  let page = qs.page;
  let limit = qs.limit;

  if (!page) {
    page = 1
  }

  if (!limit) {
    limit = 10
  }

  const { Match } = await getMongoose();
  const matches = await Match.paginate({}, { page, limit });
  const body = { matches };

  return apiResponse(body)

}

module.exports.handler = handler;