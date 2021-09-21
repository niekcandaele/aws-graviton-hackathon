import { writeFile } from 'fs/promises';
import { v4 as uuid } from 'uuid';

export async function onWatchList(watchList) {
  console.log('Got a watchlist');
  await writeFile(`./data/watchList-${uuid()}.json`, JSON.stringify(watchList, null, 2))
}