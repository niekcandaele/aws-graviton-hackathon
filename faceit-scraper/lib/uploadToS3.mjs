import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import axios from 'axios';

const client = new S3Client({ region: "eu-west-1" });

export async function uploadToS3({demoUrl, id}) {
  const started = Date.now()

  const exists = await objectExists(id)

  if (exists) {
    return;
  }


  console.log(`Uploading ${demoUrl} to S3`);
  const readStream = await getReadStream(demoUrl);

  const target = { 
    Bucket: process.env.BUCKET, 
    Key: getKey(id), 
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

function getKey(id) {
  return `faceit/${id}`;
}

async function objectExists(id) {
  const command = new HeadObjectCommand({Bucket: process.env.BUCKET,Key: getKey(id)})
  try {
    const response = await client.send(command)
    console.log(response);
    return true
  } catch (error) {
    if (error.message === 'NotFound') {
      return false;
    }
    throw error;
  }
}