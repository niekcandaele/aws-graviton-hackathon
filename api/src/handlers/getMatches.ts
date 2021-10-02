import { APIGatewayEvent, Context, Handler } from 'aws-lambda';

import { apiResponse } from '../lib/apiResponse';
import { getMongoose } from '../models';

interface IQueryString {
  page: string
  limit: string
}

const handler: Handler = async function getMatches(event: APIGatewayEvent, context: Context) {
  const qs = event.queryStringParameters as unknown as IQueryString;
  let page = parseInt(qs.page, 10) || 1;
  let limit = parseInt(qs.limit, 10) || 10;
  
  console.log(page);
  console.log(limit);
  
  const { Match } = await getMongoose();
  const matches = await Match.paginate({}, { page, limit, sort: { date: -1 } });
  const body = { matches };

  return apiResponse(body)

}

module.exports.handler = handler;