import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, Ec2Service, Ec2TaskDefinition, FargateTaskDefinition, TaskDefinition } from '@aws-cdk/aws-ecs';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import { QueueProcessingFargateService } from '@aws-cdk/aws-ecs-patterns';
import { Effect, Policy, PolicyStatement } from '@aws-cdk/aws-iam';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { CfnPermission } from '@aws-cdk/aws-lambda';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { Bucket } from '@aws-cdk/aws-s3';
import * as s3 from '@aws-cdk/aws-s3';
import { SqsDestination } from '@aws-cdk/aws-s3-notifications';
import * as sqs from '@aws-cdk/aws-sqs';
import { Construct } from '@aws-cdk/core';

import { ECRStack } from './ECR';


interface IQueueProcessorProps {
  cluster: Cluster,
  bucket: Bucket,
  ECRRepos: ECRStack,
  vpc: Vpc
}

export class QueueProcessor extends Construct {
  queue: sqs.Queue;

  constructor(scope: Construct, id: string, props: IQueueProcessorProps) {
    super(scope, id);
    const { bucket, cluster, ECRRepos, vpc } = props;

    const queue = new sqs.Queue(this, 'demo-queue', {
      // Must be false, S3 events cannot trigger FIFO queues
      // Left in comment because default is false but want to make it explicit
      // And actually passing the property as false makes CDK trip over itself :(
      //fifo: false 
    })

    if (!process.env.MONGODB_URI) {
      throw new Error('Must define the Mongo connection URI');
    }


    const queueProcessor = new QueueProcessingFargateService(this, 'QueueProcessingService', {
      image: ecs.ContainerImage.fromEcrRepository(ECRRepos.tmpContainerRepository, 'latest'),
      environment: {
        MONGODB_URI: process.env.MONGODB_URI,
        BUCKET: bucket.bucketName,
        QUEUE: queue.queueName
      },
      queue,
      cluster,
      minScalingCapacity: 1,
      maxScalingCapacity: 1,
      memoryLimitMiB: 2048,
      cpu: 512
    })

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new SqsDestination(queue))
    bucket.grantReadWrite(queueProcessor.taskDefinition.taskRole);

    this.queue = queue;

  }
}