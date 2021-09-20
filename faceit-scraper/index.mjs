import dotenv from 'dotenv';
import { writeFile } from 'fs/promises';

import { getMatchesForHub } from './lib/getHub.mjs';
import { uploadToS3 } from './lib/uploadToS3.mjs';

dotenv.config();

async function main() {
  const watchedHubs = process.env.WATCHED_FACEIT_HUBS.split(',');

  const results = await Promise.all(watchedHubs.map(getMatchesForHub));

  console.log(`Found results for ${results.length} hubs`);

  const hubMatches = results.map(hubResult => {
    return hubResult.items.map(match => {
      if (match.status !== 'FINISHED') {
        return null;
      }

      const matchData = {
        id: match.match_id,
        demoUrl: match.demo_url[0]
      }
      return matchData;
    }).filter(Boolean)
  })

  for (const hub of hubMatches) {
    console.log('Start handling of a new hub');
    await Promise.all(hub.map(matchInfo => {
      return uploadToS3(matchInfo.demoUrl)
    }))
  }

}


main()
.then()
.catch(e => {
  console.error(e)
  process.exit(1)
})