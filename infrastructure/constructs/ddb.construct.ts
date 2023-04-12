import { Stack } from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

class DDBTable {
  private name: string;

  private table: dynamodb.Table;

  constructor(private ddbTableName: string) {
    this.name = ddbTableName;
  }

  private localSecondaryIndexes = {
    LSI1: 'LSI1_SK',
    LSI2: 'LSI2_SK',
    LSI3: 'LSI3_SK',
    LSI4: 'LSI4_SK',
    LSI5: 'LSI5_SK',
  };

  initialize(stack: Stack) {
    this.table = new dynamodb.Table(stack, this.name, {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
      tableName: this.name,
    });

    for (const indexName in this.localSecondaryIndexes) {
      this.table.addLocalSecondaryIndex({
        indexName: indexName,
        projectionType: dynamodb.ProjectionType.ALL,
        sortKey: {
          name: this.localSecondaryIndexes[indexName],
          type: dynamodb.AttributeType.STRING,
        },
      });
    }
    return this.table;
  }
}

export { DDBTable };
