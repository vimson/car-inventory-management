import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ContextVariables } from '../../src/types/global.types';

export class DealersStack extends cdk.Stack {
  private contextVars: ContextVariables;

  private officeToolsApi: apigateway.RestApi;

  constructor(
    scope: Construct,
    stackId: string,
    contextVars: ContextVariables,
    props?: cdk.StackProps
  ) {
    super(scope, stackId, props);
    this.contextVars = contextVars;

    // const lambdaFn = this.getRootLambda();
    // const courseLambda = this.getCourseLambda();

    // // Create the API Gateway REST API
    // this.officeToolsApi = new apigateway.RestApi(this, `ApiGateway-${this.contextVars.stackName}`, {
    //   binaryMediaTypes: ['*/*'],
    //   deployOptions: {
    //     stageName: this.contextVars.apiVersion,
    //   },
    // });

    // this.officeToolsApi.root.addMethod('GET', new apigateway.LambdaIntegration(lambdaFn));

    // const courses = this.officeToolsApi.root.addResource('courses');
    // courses.addMethod('GET', new apigateway.LambdaIntegration(courseLambda));

    // new cdk.CfnOutput(this, `ApiEndpoint-${this.contextVars.stackName}`, {
    //   value: this.officeToolsApi.url,
    //   exportName: `ApiEndpoint-${this.contextVars.stackName}`,
    // });

    // new cdk.CfnOutput(this, `RestApiId-${this.contextVars.stackName}`, {
    //   value: this.officeToolsApi.restApiId,
    //   exportName: `RestApiId-${this.contextVars.stackName}`,
    // });
  }

  private getRootLambda(): NodejsFunction {
    return new NodejsFunction(this, `${this.contextVars.stackName}-RootLambda`, {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(10),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'rootHandler',
      entry: path.join(__dirname, `/../../src/handlers/root.handler.ts`),
      environment: this.getLambdaEnvironment(),
    });
  }

  private getCourseLambda(): NodejsFunction {
    return new NodejsFunction(this, `${this.contextVars.stackName}-CourseLambda`, {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(10),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'coursesHandler',
      entry: path.join(__dirname, `/../../src/handlers/courses.handler.ts`),
      environment: this.getLambdaEnvironment(),
    });
  }

  private getLambdaEnvironment() {
    return {
      ...this.contextVars,
    };
  }
}
