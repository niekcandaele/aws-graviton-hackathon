import { DeleteObjectCommand, S3, S3Client } from '@aws-sdk/client-s3';
import { DeleteMessageCommand, GetQueueUrlCommand, ReceiveMessageCommand, SQS, SQSClient } from '@aws-sdk/client-sqs';


async function main() {
  const queueName = process.env.QUEUE
  const bucketName = process.env.BUCKET
  const event = process.env.SQS_EVENT

  const sqsClient = new SQS({ region: 'eu-west-1' })
  const s3Client = new S3Client({ region: 'eu-west-1' })

  console.log(`Using queue ${queueName} and bucket ${bucketName}`);
  console.log('Handling event:');
  console.log(event);

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

  for (const message of data.Messages) {
    const body = JSON.parse(message.Body);
    console.log(body);
    if (!body.Record) {
      continue;
    }

    const key = body.Records[0].s3.object.key;


    // *******************************************
    // TODO:
    // Download the file
    // Do the number crunching 
    // Send the numbers to database :)
    // *******************************************

/*     const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(deleteCommand);
    console.log(`Deleted object ${key}`)

    await sqsClient.send(new DeleteMessageCommand({
      QueueUrl: queueUrlResult.QueueUrl,
      ReceiptHandle: message.ReceiptHandle,
    })); */
  }
}

main()
  .then(() => {
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })