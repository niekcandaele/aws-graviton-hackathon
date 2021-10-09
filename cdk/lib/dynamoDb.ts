import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';

export class DynamoDbStack extends Construct{
  statsTable: dynamodb.Table;
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.statsTable = new dynamodb.Table(this, 'Stats', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }
    });
  }
}