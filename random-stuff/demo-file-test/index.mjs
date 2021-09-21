import demofile from 'demofile';
import fs from 'fs/promises';

async function main() {
  const file = await fs.readFile('./1-7494dec5-8d28-4910-b395-01123399eec3-1-1.dem')
  const demoFile = new demofile.DemoFile(file);

  demoFile.parse(file);


  console.log(demoFile.header)
}


main()
.then()
.catch(e => {
  console.error(e)
  process.exit(1)
})
