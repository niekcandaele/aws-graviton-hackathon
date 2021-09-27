import { DeleteObjectCommand, GetObjectCommand, S3, S3Client } from '@aws-sdk/client-s3';
import { DeleteMessageCommand, GetQueueUrlCommand, ReceiveMessageCommand, SQS, SQSClient } from '@aws-sdk/client-sqs';

import Demo from './demo';
import { Match } from './models/Match';


async function main() {
  const queueName = process.env.QUEUE
  const bucketName = process.env.BUCKET

  const sqsClient = new SQS({ region: 'eu-west-1' })
  const s3Client = new S3Client({ region: 'eu-west-1' })

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

  // Set the parameters for retrieving the messages in the Amazon SQS Queue.
  var getMessageParams = {
    QueueUrl: queueUrlResult.QueueUrl,
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
      continue;
    }

    const body = JSON.parse(message.Body);
    if (!body.Record) {
      continue;
    }

    const key = body.Records[0].s3.object.key;

    console.log(`Handling key ${key}`);
    

    const {Body} = await s3Client.send(new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    }))

    const buffer = await streamToBuffer(Body)

    const demo = new Demo(buffer);
    const match = new Match();
    await demo.handle(match);


    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(deleteCommand);
    console.log(`Deleted object ${key}`)

    await sqsClient.send(new DeleteMessageCommand({
      QueueUrl: queueUrlResult.QueueUrl,
      ReceiptHandle: message.ReceiptHandle,
    }));

    console.log(`ACK message ${message.MessageId}`)

  }
}

setInterval(main, 30000);

main()
  .then(() => {
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })


function streamToBuffer (stream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}
