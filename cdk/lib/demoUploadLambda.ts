import * as apigateway from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import { Bucket } from '@aws-cdk/aws-s3';
import { Queue } from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';


interface IDemoUploadProps {
  bucket: Bucket,
}

export class DemoUpload extends Construct{

  constructor(scope: cdk.Construct, id: string, props: IDemoUploadProps) {
    super(scope, id);
    const {bucket} = props;

    const handler = new lambda.Function(this, "DemoUploadHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("resources"),
      handler: "uploadDemo.main",
      environment: {
        BUCKET: bucket.bucketName,
      }
    });

    bucket.grantReadWrite(handler);

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