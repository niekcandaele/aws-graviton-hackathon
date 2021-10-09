import * as cdk from '@aws-cdk/core';
import { Vpc } from '@aws-cdk/aws-ec2';
import * as sagemaker from '@aws-cdk/aws-sagemaker';
import { PropagatedTagSource } from '@aws-cdk/aws-ecs';

interface ISageMakerProps extends sagemaker.CfnModelProps{
    vpc: Vpc
    name: string;
}

interface ModelProps {
    modelDockerImage: String;
}

export class SageMaker extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, {vpc}:  ISageMakerProps){
        super(scope, id);

        const modelName = "bantr-ml"

        const model = new sagemaker.CfnModel(this, id, {
            modelName: modelName,
            containers: { },
            vpcConfig: vpc
        });
    }
    
}

