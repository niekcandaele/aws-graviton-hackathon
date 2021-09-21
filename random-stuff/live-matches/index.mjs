import dotenv from 'dotenv';

import { getCSGO } from './lib/getCSGO.mjs';
import { onMatchList } from './lib/onMatchList.mjs';

dotenv.config()


async function main() {
  const CSGO = await getCSGO();
  
  
  CSGO.requestCurrentLiveGames()
  
  setInterval(() => {
    CSGO.requestCurrentLiveGames()
  }, 30000)

  

}

main()
  .then()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })