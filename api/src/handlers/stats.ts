import { apiResponse } from '../lib/apiResponse';

const db = require('../lib/models')
module.exports.handler = async function stats(event, context) {
  const { Match } = await db.getMongoose();
  const totalMatches = await Match.count({});
  const body = { totalMatches };
  return apiResponse(body)

}