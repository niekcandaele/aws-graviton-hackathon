import { DeleteObjectCommand, GetObjectCommand, S3, S3Client } from '@aws-sdk/client-s3';
import { DeleteMessageCommand, GetQueueUrlCommand, ReceiveMessageCommand, SQS, SQSClient } from '@aws-sdk/client-sqs';
import dotenv from 'dotenv';
import zlib from 'zlib';

import Demo from './demo';
import { Match } from './models/Match';

dotenv.config()

const queueName = process.env.QUEUE
const bucketName = process.env.BUCKET
const sqsClient = new SQS({ region: 'eu-west-1' })
const s3Client = new S3Client({ region: 'eu-west-1' })

let queueUrl

async function main() {
  console.log(`Using queue ${queueName} and bucket ${bucketName}`);

  const queueParams = {
    QueueName: queueName,
    Attributes: {
      DelaySeconds: "60",
      MessageRetentionPeriod: "86400",
    },
  };

  // Get the Amazon SQS Queue URL.
  const queueUrlResult = await sqsClient.send(new GetQueueUrlCommand(queueParams));
  queueUrl = queueUrlResult.QueueUrl
  // Set the parameters for retrieving the messages in the Amazon SQS Queue.
  var getMessageParams = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10,
    MessageAttributeNames: ["All"],
    VisibilityTimeout: 20,
    WaitTimeSeconds: 20,
  };

  const data = await sqsClient.send(
    new ReceiveMessageCommand(getMessageParams)
  );

  if (!data.Messages) {
    console.log('No messages to handle, exiting')
    return;
  }

  console.log(`Received ${data.Messages.length} messages`);


  for (const message of data.Messages) {
    if (!message.Body) {
      await ackMessage(message);
      continue;
    }

    const body = JSON.parse(message.Body);
    if (!body.Records) {
      await ackMessage(message);
      continue;
    }

    const key = body.Records[0].s3.object.key;

    console.log(`Handling key ${key}`);


    const { Body } = await s3Client.send(new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    }))

    const compressedBuffer = await streamToBuffer(Body)

    try {
      const decompressed = await decompress(compressedBuffer)
      const demo = new Demo(decompressed);
      const match = new Match();
      await demo.handle(match);
    } catch (error) {
      // Let's ignore errors so the rest of the code can still do cleanup
      console.error(error);
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(deleteCommand);
    console.log(`Deleted object ${key}`)

    await ackMessage(message);
  }
}

setInterval(() => main()
  .then(() => {
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  }), 1000 * 60 * 30);

main()
  .then(() => {
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })

async function ackMessage(message) {
  await sqsClient.send(new DeleteMessageCommand({
    QueueUrl: queueUrl,
    ReceiptHandle: message.ReceiptHandle,
  }));

  console.log(`ACK message ${message.MessageId}`)
}

function streamToBuffer(stream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}


async function decompress(buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    zlib.gunzip(buffer, (e, buffer) => {
      if (e) {
        reject(e)
      } else {
        resolve(buffer)
      }
    })
  })
}