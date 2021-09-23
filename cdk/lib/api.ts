import * as apigateway from '@aws-cdk/aws-apigateway';
import { Vpc } from '@aws-cdk/aws-ec2';
import * as lambda from '@aws-cdk/aws-lambda';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { Bucket } from '@aws-cdk/aws-s3';
import { Queue } from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';

interface IAPIProps {
  vpc: Vpc,
  queue: Queue
}

export class API extends Construct{

  constructor(scope: cdk.Construct, id: string, props: IAPIProps) {
    super(scope, id);

    const api = new apigateway.RestApi(this, "bantr-api", {
      restApiName: "Bantr API",
      description: "CSGO stats",
    });

    if (!process.env.MONGODB_URI) {
      throw new Error('Must define the Mongo connection URI');
    }

    const statsLambda = new lambda.Function(this, 'StatsLambda', {
      code: lambda.Code.fromAsset('../api/api-lambdas.zip'),
      handler: 'src/handlers/stats.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      vpc: props.vpc
    })
    statsLambda.addEnvironment('MONGODB_URI', process.env.MONGODB_URI )

    const statsLambdaIntegration = new apigateway.LambdaIntegration(statsLambda, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    });
    const stats = api.root.addResource("stats");
    stats.addMethod("GET", statsLambdaIntegration);






  }


}