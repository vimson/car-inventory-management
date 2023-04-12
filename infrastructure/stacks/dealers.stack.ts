import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { ContextVariables } from '../../src/types/global.types';
import { DDBTable } from '../constructs/ddb.construct';
import { DealerApiGateway } from '../constructs/dealer-gateway.construct';
import { CarLambdas } from '../constructs/car-lambdas.construct';

export class DealersStack extends cdk.Stack {
  private contextVars: ContextVariables;

  private dealersApi: apigateway.RestApi;

  private dealersTable: dynamodb.Table;

  constructor(
    scope: Construct,
    stackId: string,
    contextVars: ContextVariables,
    props?: cdk.StackProps
  ) {
    super(scope, stackId, props);
    this.contextVars = contextVars;

    this.dealersTable = new DDBTable(this.contextVars.ddbTableName).initialize(this);
    this.dealersApi = new DealerApiGateway(
      this.contextVars.stackName,
      this.contextVars.token
    ).initialize(this, this.getLambdas(this));

    new cdk.CfnOutput(this, `RestApiUrl${this.stackName}`, {
      value: this.dealersApi.url,
      exportName: `RestApiUrl${this.stackName}`,
    });
  }

  getLambdas(stack: cdk.Stack): Record<string, NodejsFunction> {
    const lambdaEnvironment = {
      environment: this.contextVars.environment,
      DEALERS_TABLE: this.contextVars.ddbTableName,
    };

    const carLambdas = new CarLambdas(stack, this.stackName, lambdaEnvironment);
    const lambdas = {
      cars: carLambdas.cars(),
      createCar: carLambdas.createCar(),
      updateCar: carLambdas.updateCar(),
      getCar: carLambdas.getCar(),
      removeCar: carLambdas.removeCar(),
    };

    // Adding Read/write permissions to all lambdas
    for (const lambda in lambdas) {
      this.dealersTable.grantReadWriteData(lambdas[lambda]);
    }

    return lambdas;
  }
}
