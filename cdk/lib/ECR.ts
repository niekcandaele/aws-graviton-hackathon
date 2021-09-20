import * as ecr from '@aws-cdk/aws-ecr';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from '@aws-cdk/core';


/**
 * Our application includes a couple of Docker containers
 * In this Construct, we set up the ECR repository and the IAM role to be used in CI/CD
 */
export class ECRStack extends Construct{
  tmpContainerRepository: ecr.Repository;
  faceitScraperRepository: ecr.Repository;
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    // We take the security credentials of this user
    // And store it in Github Actions as secrets
    const githubUser = new iam.User(this, 'githubUser');
    
    const tmpContainerRepository = new ecr.Repository(this, 'tmpContainerRepository');
    tmpContainerRepository.addLifecycleRule({maxImageCount: 3})
    tmpContainerRepository.grantPullPush(githubUser)

    const faceitScraperRepository = new ecr.Repository(this, 'faceitScraperRepository');
    faceitScraperRepository.addLifecycleRule({maxImageCount: 3})
    faceitScraperRepository.grantPullPush(githubUser)


    this.tmpContainerRepository = tmpContainerRepository;
    this.faceitScraperRepository = faceitScraperRepository;
  }


}