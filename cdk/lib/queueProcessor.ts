import { Cluster } from '@aws-cdk/aws-ecs';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import { Bucket } from '@aws-cdk/aws-s3';
import * as s3 from '@aws-cdk/aws-s3';
import { SqsDestination } from '@aws-cdk/aws-s3-notifications';
import * as sqs from '@aws-cdk/aws-sqs';
import { Construct } from '@aws-cdk/core';

import { ECRStack } from './ECR';


interface IQueueProcessorProps {
  cluster: Cluster,
  bucket: Bucket,
  ECRRepos: ECRStack
}

export class QueueProcessor extends Construct {
  queue: sqs.Queue;

  constructor(scope: Construct, id: string, props: IQueueProcessorProps) {
    super(scope, id);
    const {bucket, cluster, ECRRepos} = props;

    const queue = new sqs.Queue(this, 'demo-queue', {
      // Must be false, S3 events cannot trigger FIFO queues
      // Left in comment because default is false but want to make it explicit
      // And actually passing the property as false makes CDK trip over itself :(
      //fifo: false 
    })

    const queueProcessor = new ecs_patterns.QueueProcessingFargateService(this, "MyQueueProcessingFargateService", {
      image: ecs.ContainerImage.fromEcrRepository(ECRRepos.tmpContainerRepository, 'latest'),
      cluster,
      queue,
      environment: {
        BUCKET: bucket.bucketName,
        QUEUE: queue.queueName
      },
      minScalingCapacity: 0,
      maxScalingCapacity: 0
    })

    bucket.grantReadWrite(queueProcessor.taskDefinition.taskRole);
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new SqsDestination(queue))

    this.queue = queue;
  }


}