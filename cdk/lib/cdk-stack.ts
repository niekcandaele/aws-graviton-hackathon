import * as ec2 from '@aws-cdk/aws-ec2';
import { FlowLog, FlowLogDestination, FlowLogResourceType } from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { LogGroup, RetentionDays } from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as core from '@aws-cdk/core';
import * as dotenv from 'dotenv';

import { API } from './api';
import { DemoUpload } from './demoUploadLambda';
import { ECRStack } from './ECR';
import { FaceitScraper } from './faceitScraper';
import { Mongo } from './MongoStack';
import { QueueProcessor } from './queueProcessor';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    dotenv.config();

    const bucket = new s3.Bucket(this, 'graviton-hackathon-demos', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(3),
        }
      ]
    });
    
    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 3, // Default is all AZs in region,
      natGateways: 1
    });
    
    const logGroupFlowLog = new LogGroup(this, 'flowlogLogGroup', {
      retention: RetentionDays.ONE_WEEK
    })

    vpc.addFlowLog('FlowLog', {
      destination: FlowLogDestination.toCloudWatchLogs(logGroupFlowLog)
    })

    const cluster = new ecs.Cluster(this, "MyCluster", {
      vpc: vpc,
      capacity: {
        instanceType: new ec2.InstanceType('m6g.medium'),
        machineImage: ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.ARM)
      },
      enableFargateCapacityProviders: true,
    });
    
    
    const ECRRepos = new ECRStack(this, 'ECRStack')
    const queueProcessor = new QueueProcessor(this, 'QueueProcessor', {ECRRepos,bucket,cluster, vpc})
    const demoUpload = new DemoUpload(this, 'DemoUpload', {bucket})
    const mongo = new Mongo(this, 'Mongo', {vpc})
    const faceitScraper = new FaceitScraper(this, 'FaceitScraper', {ECRRepos,bucket,cluster})
    const api = new API(this, 'API', {vpc})
  }
}
