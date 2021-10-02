import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as ecr from '@aws-cdk/aws-ecr';
import * as iam from '@aws-cdk/aws-iam';
import { AnyPrincipal } from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';



export class Frontend extends Construct {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);
    // We take the security credentials of this user
    // And store it in Github Actions as secrets
    const githubUserFrontend = new iam.User(this, 'githubUserFrontend');

    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: 'bantr.app',
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: false,
    });

    siteBucket.grantReadWrite(githubUserFrontend);

    siteBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [siteBucket.arnForObjects('*')],
      principals: [new AnyPrincipal()],
      // Cloudflare IPs
      // see: https://support.cloudflare.com/hc/en-us/articles/360037983412-Configuring-an-Amazon-Web-Services-static-site-to-use-Cloudflare
      conditions: {
        "IpAddress": {
          "aws:SourceIp": [
            "2400:cb00::/32",
            "2606:4700::/32",
            "2803:f800::/32",
            "2405:b500::/32",
            "2405:8100::/32",
            "2a06:98c0::/29",
            "2c0f:f248::/32",
            "173.245.48.0/20",
            "103.21.244.0/22",
            "103.22.200.0/22",
            "103.31.4.0/22",
            "141.101.64.0/18",
            "108.162.192.0/18",
            "190.93.240.0/20",
            "188.114.96.0/20",
            "197.234.240.0/22",
            "198.41.128.0/17",
            "162.158.0.0/15",
            "172.64.0.0/13",
            "131.0.72.0/22",
            "104.16.0.0/13",
            "104.24.0.0/14"
          ]
        }
      }
    }));

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'SiteDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: siteBucket,
          },
          behaviors: [{
            isDefaultBehavior: true,
            compress: true,
            allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
          }],
        }
      ]
    });
    new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
  }
}