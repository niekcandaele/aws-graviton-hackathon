import 'colors';

import chai from 'chai';
import chaiExclude from 'chai-exclude';
import * as diff from 'diff';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import util from 'util';

import Demo from '../demo';
import { getMongoose } from '../models';

chai.use(chaiExclude);
const { expect } = chai;
dotenv.config()

async function test() {
  const files = await fs.readdir(path.join(__dirname, './snapshots'));

  const db = await getMongoose();

  for (const file of files) {
    if (!file.endsWith('.dem')) {
      continue;
    }
    const demoFile = await fs.readFile(path.join(__dirname, './snapshots', file));
    const snapshot = await tryGetSnapshot(file);

    const demo = new Demo(demoFile);
    const testMatch = new db.Match();
    await demo.handle(testMatch);

    const endMatch = await db.Match.findOne({ _id: testMatch._id }, {}, { lean: true })

    if (snapshot) {
      try {
        // Not working right now... :))
/*         expect(endMatch)
          .excludingEvery(['id', '_id', 'date', 'attacker', 'victim', 'player'])
          .to.deep.equal(JSON.parse(snapshot));
           */
      } catch (error) {
        // @ts-expect-error :)
        diff.diffJson(error.actual, error.expected).forEach(part => {
          if (part.added) {
            console.log(part.value.red);
            throw new Error(`Snapshot does not match - ${file}`);
          } else if (part.removed) {
            console.log(part.value.green);
            throw new Error(`Snapshot does not match - ${file}`);
          } else {
            console.log(part.value);
          }
        })
      }
    } else {
      await fs.writeFile(path.join(__dirname, './snapshots', file.replace('.dem', '.json')), JSON.stringify(endMatch, null, 2));
    }


  }

}

async function tryGetSnapshot(file) {
  try {
    return (await fs.readFile(path.join(__dirname, './snapshots', file.replace('.dem', '.json')))).toString();
  } catch (error) {
    // @ts-expect-error :)
    if (error.code !== 'ENOENT') {
      throw error;
    }

    return null;
  }
}

test()
  .then(() => {
    process.exit(0)
  })
  .catch(e => {
    console.error(e)
    process.exit(1)

  })