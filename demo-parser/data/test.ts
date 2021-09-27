import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

import Demo from '../demo';
import { getMongoose } from '../models';

async function test() {
  dotenv.config()
  const buffer = await fs.readFile(path.join(__dirname, './1-0c9767d4-105c-4c89-95dd-623c00ef0dd3.dem'));
  const db = await getMongoose();
  const demo = new Demo(buffer);

  const testMatch = new db.Match();

  await demo.handle(testMatch);
}


test()
  .then(() => {
    process.exit(0)
  })
  .catch(e => {
    console.error(e)
    process.exit(1)

  })