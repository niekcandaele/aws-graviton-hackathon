import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import axios from 'axios';


const client = new S3Client({ region: "eu-west-1" });

const KEY_REGEX = /csgo\/(.+\.dem\.gz)/i

export async function uploadToS3(demoUrl) {
  const started = Date.now()
  console.log(`Uploading ${demoUrl} to S3`);
  const Key = KEY_REGEX.exec(demoUrl)[1];
  const readStream = await getReadStream(demoUrl);

  const target = { 
    Bucket: process.env.BUCKET, 
    Key, 
    Body: readStream
  };
  const uploadReq = new Upload({
    params: target,
    client
  })

  uploadReq.on("httpUploadProgress", (progress) => {
    console.log(`Progress update for ${demoUrl} - Part ${progress.part}`);
  });

  
  await uploadReq.done();
  const ended = Date.now()
  console.log(`Finished ${demoUrl} in ${ended - started} ms`);
}

function getReadStream(url) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      responseType: 'stream'
    }).then(response => {
      resolve(response.data);
    })
  })
}