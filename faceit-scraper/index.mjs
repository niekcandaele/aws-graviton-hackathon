import dotenv from 'dotenv';

import { getMatchesForHub } from './lib/getHub.mjs';
import { getMongoose } from './lib/models/index.mjs';
import { uploadToS3 } from './lib/uploadToS3.mjs';

dotenv.config();

async function main() {
  const { Match } = await getMongoose();
  const watchedHubs = process.env.WATCHED_FACEIT_HUBS.split(',');

  const results = await Promise.all(watchedHubs.map(getMatchesForHub));

  console.log(`Found results for ${results.length} hubs`);

  const hubMatches = results.map(hubResult => {
    return hubResult.items.map(match => {
      if (match.status !== 'FINISHED') {
        return null;
      }

      const team1 = match.teams.faction1.roster.map(faceitFactionPlayer)
      const team2 = match.teams.faction2.roster.map(faceitFactionPlayer)

      const matchData = {
        id: match.match_id,
        demoUrl: match.demo_url[0],
        team1,
        team2,
      }
      return matchData;
    }).filter(Boolean)
  })

  for (const hub of hubMatches) {
    console.log('Start handling of a new hub');

    await Promise.all(hub.map(async matchInfo => {
      const match = new Match({
        id: matchInfo.id,
        demoUrl: matchInfo.demoUrl,
        type: 'faceit',
        team1: matchInfo.team1,
        team2: matchInfo.team2,
      });
      try {
        await match.save()
      } catch (error) {
        if (!error.message.includes('E11000 duplicate')) {
          throw error
        }
        return;
      }
      return uploadToS3(matchInfo)
    }))
  }

}


main()
  .then()
  .catch(e => {
    if (e.isAxiosError) {
      console.error(`Axios error for ${e.path}`)
      console.error(e.response.status)
    } else {
      console.error(e)
    }

    process.exit(1)
  })


function faceitFactionPlayer(p) {
  return {
    steamId: p.game_player_id,
    rank: p.game_skill_level
  }
}