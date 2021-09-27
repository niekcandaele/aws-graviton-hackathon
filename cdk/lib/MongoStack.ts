import { ClusterParameterGroup, DatabaseCluster } from '@aws-cdk/aws-docdb';
import * as ec2 from '@aws-cdk/aws-ec2';
import { AmazonLinuxCpuType, BastionHostLinux, Peer, Vpc } from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
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
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      vpc,
      parameterGroup: parametergroup,
    });

    databaseCluster.connections.allowDefaultPortFromAnyIpv4();

    const sshServerSG = new ec2.SecurityGroup(this, 'webserver-sg', {
      vpc,
      allowAllOutbound: true,
    });

    sshServerSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'allow SSH access from anywhere',
    );

    const sshServerRole = new iam.Role(this, 'sshserver-role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDocDBFullAccess'),
      ],
    });

    const ec2Instance = new ec2.Instance(this, 'ec2-instance', {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      role: sshServerRole,
      securityGroup: sshServerSG,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO,
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: 'cata',
    });

  }
}