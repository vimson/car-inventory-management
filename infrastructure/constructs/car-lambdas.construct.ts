import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

class CarLambdas {
  private stack: cdk.Stack;

  private stackName: string;

  constructor(stack: cdk.Stack, stackName: string) {
    this.stack = stack;
    this.stackName = stackName;
  }

  root(): NodejsFunction {
    return new NodejsFunction(this.stack, `${this.stackName}-RootLambda`, {
      functionName: `${this.stackName}-RootLambda`,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(10),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'rootHandler',
      entry: path.join(__dirname, `/../../src/handlers/root.handler.ts`),
      environment: {},
    });
  }

  cars(): NodejsFunction {
    return new NodejsFunction(this.stack, `${this.stackName}-Cars`, {
      functionName: `${this.stackName}-Cars`,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(10),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'carsHandler',
      entry: path.join(__dirname, `/../../src/handlers/cars.handler.ts`),
      environment: {},
    });
  }

  getCar(): NodejsFunction {
    return new NodejsFunction(this.stack, `${this.stackName}-GetCar`, {
      functionName: `${this.stackName}-GetCar`,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(10),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'getCarHandler',
      entry: path.join(__dirname, `/../../src/handlers/cars.handler.ts`),
      environment: {},
    });
  }

  createCar(): NodejsFunction {
    return new NodejsFunction(this.stack, `${this.stackName}-CreateCar`, {
      functionName: `${this.stackName}-CreateCar`,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(10),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'createCarHandler',
      entry: path.join(__dirname, `/../../src/handlers/cars.handler.ts`),
      environment: {},
    });
  }

  updateCar(): NodejsFunction {
    return new NodejsFunction(this.stack, `${this.stackName}-UpdateCar`, {
      functionName: `${this.stackName}-UpdateCar`,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(10),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'updateCarHandler',
      entry: path.join(__dirname, `/../../src/handlers/cars.handler.ts`),
      environment: {},
    });
  }

  removeCar(): NodejsFunction {
    return new NodejsFunction(this.stack, `${this.stackName}-RemoveCar`, {
      functionName: `${this.stackName}-RemoveCar`,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(10),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'removeCarHandler',
      entry: path.join(__dirname, `/../../src/handlers/cars.handler.ts`),
      environment: {},
    });
  }
}

export { CarLambdas };
