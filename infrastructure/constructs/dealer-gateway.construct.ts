import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { CarLambdas } from './car-lambdas.construct';

class DealerApiGateway {
  private restApi: apigateway.RestApi;

  constructor(private stackName: string) {}

  initialize(stack: cdk.Stack, lambdas: Record<string, NodejsFunction>): apigateway.RestApi {
    this.restApi = new apigateway.RestApi(stack, `RestAPI${this.stackName}`, {
      restApiName: `RestAPI${this.stackName}`,
    });

    const carLambdas = new CarLambdas(stack, this.stackName);
    this.restApi.root.addMethod('GET', new apigateway.LambdaIntegration(carLambdas.root()));

    const cars = this.restApi.root.addResource('cars');
    cars.addMethod('GET', new apigateway.LambdaIntegration(lambdas.cars));
    cars.addMethod('POST', new apigateway.LambdaIntegration(lambdas.createCar));
    cars.addMethod('PUT', new apigateway.LambdaIntegration(lambdas.updateCar));

    const car = cars.addResource('{carId}');
    car.addMethod('GET', new apigateway.LambdaIntegration(lambdas.getCar));
    car.addMethod('DELETE', new apigateway.LambdaIntegration(lambdas.removeCar));

    return this.restApi;
  }
}

export { DealerApiGateway };
