import { ClusterParameterGroup, DatabaseCluster } from '@aws-cdk/aws-docdb';
import * as ec2 from '@aws-cdk/aws-ec2';
import { Vpc } from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';


interface IMongoProps {
  vpc: Vpc
}

export class Mongo extends Construct{

  constructor(scope: cdk.Construct, id: string, props: IMongoProps) {
    super(scope, id);
    const {vpc} = props;

    const parametergroup = new ClusterParameterGroup(this, 'docdbParameterGroup', {
      family: "docdb4.0",
      parameters: {
        tls: 'disabled'
      }
    })

    const databaseCluster = new DatabaseCluster(this, 'Database', {
      masterUser: {
        username: 'demos'
      },
      // Cant run this on Graviton instances 😢
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.LARGE),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      vpc,
      parameterGroup: parametergroup,
    });

    databaseCluster.connections.allowDefaultPortFromAnyIpv4()
  }
}