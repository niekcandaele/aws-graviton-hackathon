const db = require('../lib/models')
module.exports.handler = async function stats(event, context) {
  const { Match } = await db.getMongoose();

  const totalMatches = await Match.count({});

  const body = { totalMatches };


  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(body),
    isBase64Encoded: false
  }

}