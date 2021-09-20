import { writeFile } from 'fs/promises';
import Long from 'long';
import { v4 as uuid } from 'uuid';

import { getCSGO } from './getCSGO.mjs';

export async function onMatchList(matchList) {
  await writeFile(`./data/matchList-${uuid()}.json`, JSON.stringify(matchList, null, 2));
  const CSGO = await getCSGO();

  for (const match of matchList.matches) {
    const matchId = new Long(match.matchid.low, match.matchid.high, true).toString()
    const serverId = new Long(match.watchablematchinfo.server_id.low, match.watchablematchinfo.server_id.high, true).toString()
    CSGO.requestWatchInfoFriends({
      matchid: matchId,
      serverid: serverId
    });


    console.log(`Requested info on match ${matchId}`)
    await waitSecond(1);
  }
}

async function waitSecond(seconds) {
  await new Promise(resolve => setTimeout(resolve, seconds * 1000));
}