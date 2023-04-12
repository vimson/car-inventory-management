import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { CarLambdas } from './car-lambdas.construct';

class DealerApiGateway {
  private restApi: apigateway.RestApi;

  constructor(private stackName: string, private token: string) {}

  initialize(stack: cdk.Stack, lambdas: Record<string, NodejsFunction>): apigateway.RestApi {
    const authorizer = this.getCustomAuthorizer(stack);

    this.restApi = new apigateway.RestApi(stack, `RestAPI${this.stackName}`, {
      restApiName: `RestAPI${this.stackName}`,
    });

    const carLambdas = new CarLambdas(stack, this.stackName, {});
    this.restApi.root.addMethod('GET', new apigateway.LambdaIntegration(carLambdas.root()));

    const cars = this.restApi.root.addResource('cars');
    cars.addMethod('GET', new apigateway.LambdaIntegration(lambdas.cars));
    cars.addMethod('POST', new apigateway.LambdaIntegration(lambdas.createCar), {
      authorizer,
    });

    const car = cars.addResource('{carId}');
    car.addMethod('GET', new apigateway.LambdaIntegration(lambdas.getCar), {
      authorizer,
    });
    car.addMethod('DELETE', new apigateway.LambdaIntegration(lambdas.removeCar), {
      authorizer,
    });
    car.addMethod('PUT', new apigateway.LambdaIntegration(lambdas.updateCar), {
      authorizer,
    });

    return this.restApi;
  }

  private getCustomAuthorizer(stack: cdk.Stack) {
    const authorizerFn = new NodejsFunction(stack, `${this.stackName}-BasicAuthAuthorizer`, {
      functionName: `${this.stackName}-BasicAuthAuthorizer`,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(10),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'authorizer',
      entry: path.join(__dirname, `/../../src/handlers/auth.handler.ts`),
      environment: { token: this.token },
    });

    const authorizer = new apigateway.TokenAuthorizer(
      stack,
      '${this.stackName}-CustomBasicAuthAuthorizer',
      {
        handler: authorizerFn,
        identitySource: 'method.request.header.Authorization',
        resultsCacheTtl: cdk.Duration.seconds(0),
      }
    );

    return authorizer;
  }
}

export { DealerApiGateway };
