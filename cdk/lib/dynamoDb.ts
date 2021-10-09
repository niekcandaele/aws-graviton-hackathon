import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';


/**
 * Our application includes a couple of Docker containers
 * In this Construct, we set up the ECR repository and the IAM role to be used in CI/CD
 */
export class DynamoDbStack extends Construct{
  statsTable: dynamodb.Table;
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.statsTable = new dynamodb.Table(this, 'Stats', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }
    });
  }


}