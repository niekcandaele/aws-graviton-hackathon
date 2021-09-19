import * as apigateway from '@aws-cdk/aws-apigateway';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import { SqsDestination } from '@aws-cdk/aws-s3-notifications';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as core from '@aws-cdk/core';


export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'graviton-hackathon-demos', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      
    });
    
    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 3, // Default is all AZs in region,
      
    });
    
    const cluster = new ecs.Cluster(this, "MyCluster", {
      vpc: vpc,
      capacity: {
        instanceType: new ec2.InstanceType('m6g.medium'),
        machineImage: ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.ARM)
      }
    });
    
    const queue = new sqs.Queue(this, 'demo-queue', {
      // Must be false, S3 events cannot trigger FIFO queues
      // Left in comment because default is false but want to make it explicit
      // And actually passing the property as false makes CDK trip over itself :(
      //fifo: false 
    })
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new SqsDestination(queue))

    const queueProcessor = new ecs_patterns.QueueProcessingFargateService(this, "MyQueueProcessingFargateService", {
      image: ecs.ContainerImage.fromRegistry("ghcr.io/niekcandaele/aws-graviton-hackathon:latest"),
      cluster,
      queue,
      minScalingCapacity: 0,
      maxReceiveCount: 1,
    })


    const handler = new lambda.Function(this, "DemoUploadHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("resources"),
      handler: "uploadDemo.main",
      environment: {
        BUCKET: bucket.bucketName
      }
    });

    bucket.grantReadWrite(handler); 
    bucket.grantReadWrite(queueProcessor.taskDefinition.taskRole); 

    const api = new apigateway.RestApi(this, "demos-api", {
      restApiName: "Demos service",
      description: "Upload demos and stuff"
    });

    const uploadDemoIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    api.root.addMethod("POST", uploadDemoIntegration); 


  }
}
