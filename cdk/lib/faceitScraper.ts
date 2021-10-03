import { Cluster } from '@aws-cdk/aws-ecs';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import { ScheduledFargateTask } from '@aws-cdk/aws-ecs-patterns';
import { Schedule } from '@aws-cdk/aws-events';
import { Bucket } from '@aws-cdk/aws-s3';
import * as s3 from '@aws-cdk/aws-s3';
import { SqsDestination } from '@aws-cdk/aws-s3-notifications';
import * as sqs from '@aws-cdk/aws-sqs';
import { Construct } from '@aws-cdk/core';

import { ECRStack } from './ECR';



interface IFaceitScraperProps {
  cluster: Cluster,
  bucket: Bucket,
  ECRRepos: ECRStack
}

export class FaceitScraper extends Construct {
  queue: sqs.Queue;

  constructor(scope: Construct, id: string, props: IFaceitScraperProps) {
    super(scope, id);
    const {bucket, cluster, ECRRepos} = props;


    if (!process.env.FACEIT_API) {
      throw new Error('Must define the Faceit API key');
    }

    if (!process.env.MONGODB_URI) {
      throw new Error('Must define the Mongo connection URI');
    }

    const scheduledFargateTask = new ScheduledFargateTask(this, 'Faceit-scraper', {
      cluster,
      scheduledFargateTaskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(ECRRepos.faceitScraperRepository, 'latest'),
        memoryLimitMiB: 1024,
        environment: {
          WATCHED_FACEIT_HUBS: '74624044-158f-446a-ad4f-cbd2e0e89423,6f63b115-f45e-42b7-88ef-2a96714cd5e1,bfbb0657-8694-4278-8007-a7dc58f544af',
          FACEIT_API: process.env.FACEIT_API,
          BUCKET: bucket.bucketName,
          MONGODB_URI: process.env.MONGODB_URI
        }
      },
      schedule: Schedule.expression('rate(2 hours)'),
      platformVersion: ecs.FargatePlatformVersion.LATEST,
    });

    bucket.grantReadWrite(scheduledFargateTask.taskDefinition.taskRole);
  }


}