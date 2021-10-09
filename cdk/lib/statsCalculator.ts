import { Table } from '@aws-cdk/aws-dynamodb';
import { Vpc } from '@aws-cdk/aws-ec2';
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



interface IStatsCalculatorProps {
  cluster: Cluster,
  ECRRepos: ECRStack,
  table: Table,
  vpc: Vpc
}

export class StatsCalculator extends Construct {
  queue: sqs.Queue;

  constructor(scope: Construct, id: string, props: IStatsCalculatorProps) {
    super(scope, id);
    const {table, cluster, ECRRepos, vpc} = props;

    if (!process.env.MONGODB_URI) {
      throw new Error('Must define the Mongo connection URI');
    }

    const scheduledFargateTask = new ScheduledFargateTask(this, 'Stats-Calculator', {
      cluster,
      scheduledFargateTaskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(ECRRepos.statsCalculatorRepository, 'latest'),
        memoryLimitMiB: 2048,
        environment: {
          MONGO_URI: process.env.MONGODB_URI,
          MONGO_DB: 'test',
          DYNAMO_TABLE: table.tableName,
        },

      },
      vpc,
      schedule: Schedule.expression('rate(1 hour)'),
      platformVersion: ecs.FargatePlatformVersion.LATEST,
    });

    table.grantReadWriteData(scheduledFargateTask.taskDefinition.taskRole);
    if (!scheduledFargateTask.taskDefinition.executionRole) {
      throw new Error('Task definition should have an execution role')
    }
    table.grantReadWriteData(scheduledFargateTask.taskDefinition.executionRole)

  }


}