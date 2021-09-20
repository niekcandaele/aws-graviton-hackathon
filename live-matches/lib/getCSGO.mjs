import csgo from 'csgo';
import steam from 'steam';

import { onMatchList } from './onMatchList.mjs';
import { onWatchList } from './onWatchList.mjs';

const { SteamClient, SteamGameCoordinator, SteamUser } = steam;
const { CSGOClient } = csgo


let isReady = false;
let client;

export async function getCSGO() {

  if (!isReady) {
    client = await initialize();
  }

  return client;

}

async function initialize() {
  return new Promise(function (resolve, reject) {
    const steamClient = new SteamClient()
    const steamUser = new SteamUser(steamClient)
    const steamGC = new SteamGameCoordinator(steamClient, 730)
    const CSGO = new CSGOClient(steamUser, steamGC, false)

    const loginDetails = {
      account_name: process.env.STEAM_USERNAME,
      password: process.env.STEAM_PASSWORD,
    }

    function onUnhandledMessage(message) {
      console.log("Unhandled msg");
      console.log(message);
    }

    function onConnected() {
      console.log(`Connected to steam, trying to log in now`)
      steamUser.logOn(loginDetails);
    }

    async function onReady() {
      console.log('Ready to rumble!');
      isReady = true;
      resolve(CSGO);
    }

    function onUnReady() {
      console.error('CSGO unready, something is up with the GameCoordinator connection... Currently unable to talk to the CSGO servers.')
    }

    async function onSteamLogon(response) {
      if (response.eresult !== steam.EResult.OK) {
        console.error(response)
        return reject('Could not login 😢');
      }
      console.log('Successfully logged into steam, starting CSGO...')
      CSGO.launch();
    }

    steamClient.on('connected', onConnected);
    steamClient.on('logOnResponse', onSteamLogon);

    CSGO.on('ready', onReady);
    CSGO.on('unready', onUnReady);

    CSGO.on('matchList', onMatchList)
    CSGO.on('watchList', onWatchList)

    CSGO.on("unhandled", onUnhandledMessage);

    steamClient.connect();
  })
}

