import * as apigateway from '@aws-cdk/aws-apigateway';
import { RestApi } from '@aws-cdk/aws-apigateway';
import { WebSocketApi, WebSocketStage } from '@aws-cdk/aws-apigatewayv2';
import { LambdaWebSocketIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { Vpc } from '@aws-cdk/aws-ec2';
import * as lambda from '@aws-cdk/aws-lambda';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
import { Bucket } from '@aws-cdk/aws-s3';
import { Queue } from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { CfnOutput, Construct } from '@aws-cdk/core';

interface IAPIProps {
  vpc: Vpc,
}

export class API extends Construct {

  constructor(scope: cdk.Construct, id: string, props: IAPIProps) {
    super(scope, id);
    const { vpc } = props;

    const api = new apigateway.RestApi(this, "bantr-api", {
      restApiName: "Bantr API",
      description: "CSGO stats",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      }
    });

    if (!process.env.MONGODB_URI) {
      throw new Error('Must define the Mongo connection URI');
    }

    const statsLambda = new BantrLambda({ api, vpc, name: 'stats', scope })
    const stats = api.root.addResource("stats");
    stats.addMethod("GET", statsLambda.integration);


    const matchesLambda = new BantrLambda({ api, vpc, name: 'getMatches', scope })
    const matches = api.root.addResource("matches");
    matches.addMethod('GET', matchesLambda.integration);

    const matchLambda = new BantrLambda({ api, vpc, name: 'getMatch', scope })
    const match = matches.addResource("{id}");
    match.addMethod('GET', matchLambda.integration);

    const scoreboardLambda = new BantrLambda({ api, vpc, name: 'getScoreboard', scope })
    const scoreboard = match.addResource("scoreboard");
    scoreboard.addMethod('GET', scoreboardLambda.integration);

    const fullMatchLambda = new BantrLambda({ api, vpc, name: 'getFullMatch', scope })
    const fullMatch = match.addResource("full");
    fullMatch.addMethod('GET', fullMatchLambda.integration);

    const killLambda = new BantrLambda({ api, vpc, name: 'getKill', scope })
    const kill = api.root.addResource('kill')
    const killId = kill.addResource('{id}')
    killId.addMethod('GET', killLambda.integration);

    const roundLambda = new BantrLambda({ api, vpc, name: 'getRound', scope })
    const round = api.root.addResource('rounds')
    const roundId = round.addResource('{id}')
    roundId.addMethod('GET', roundLambda.integration);

  }


}

interface IBantrLambdaProps {
  name: string,
  scope: cdk.Construct
  vpc: Vpc,
  api: RestApi
}

class BantrLambda {
  lambda: lambda.Function;
  integration: apigateway.LambdaIntegration;
  constructor(props: IBantrLambdaProps) {
    if (!process.env.MONGODB_URI) {
      throw new Error('Must define the Mongo connection URI');
    }

    this.lambda = new lambda.Function(props.scope, props.name, {
      code: lambda.Code.fromAsset('../api/api-lambdas.zip'),
      handler: `build/handlers/${props.name}.handler`,
      runtime: lambda.Runtime.NODEJS_14_X,
      vpc: props.vpc,
      timeout: cdk.Duration.seconds(30),
    })

    this.lambda.addEnvironment('MONGODB_URI', process.env.MONGODB_URI)

    this.integration = new apigateway.LambdaIntegration(this.lambda, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    });


  }
}