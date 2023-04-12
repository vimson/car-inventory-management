import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import {
  DynamoDBClient,
  BatchWriteItemCommand,
  DynamoDBClientConfig,
  WriteRequest,
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';

class DynamoDBRepository {
  private ddbClient: DynamoDBClient;

  constructor() {
    let config: DynamoDBClientConfig = {
      region: process.env.AWS_REGION,
    };
    config =
      process.env.environment === 'test'
        ? Object.assign(config, {
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY,
              secretAccessKey: process.env.AWS_SECRET_KEY,
            },
          })
        : config;
    this.ddbClient = new DynamoDBClient(config);
  }

  async save(document: any) {
    const params = {
      TableName: `${process.env.DEALERS_TABLE}`,
      Item: document,
    };
    await this.ddbClient.send(new PutItemCommand(params));
  }

  async saveBatch(entities: WriteRequest[]) {
    const params = {
      RequestItems: {
        [`${process.env.IMPRESSION_TABLE}`]: entities,
      },
    };
    await this.ddbClient.send(new BatchWriteItemCommand(params));
  }

  async find(searchOptions: QueryCommandInput) {
    const result = await this.ddbClient.send(new QueryCommand(searchOptions));
    return result;
  }

  async getItemByKey<T>(partitionKey: string, sortKey: string): Promise<T | null> {
    const params = {
      TableName: `${process.env.DEALERS_TABLE}`,
      Key: marshall({
        PK: partitionKey,
        SK: sortKey,
      }),
    };
    const document = await this.ddbClient.send(new GetItemCommand(params));
    return document?.Item ? (unmarshall(document.Item) as unknown as T) : null;
  }

  async findByKey<T>(indexName: string, partitionKey: string, sortKey: string): Promise<T | null> {
    const params: QueryCommandInput = {
      TableName: process.env.DEALERS_TABLE,
      IndexName: indexName,
      ScanIndexForward: false,
      ExpressionAttributeNames: {
        '#pk': 'PK',
        '#sk': 'LSI-1-SK',
      },
      KeyConditionExpression: '#pk = :pk and #sk = :sk',
      ExpressionAttributeValues: {
        ':pk': { S: partitionKey },
        ':sk': { S: sortKey },
      },
    };
    const document = await this.ddbClient.send(new QueryCommand(params));
    return document?.Items?.length ? (unmarshall(document?.Items[0]) as unknown as T) : null;
  }

  formatToDDBEntity(entity: Record<string, any>): WriteRequest {
    return marshall(entity);
  }
}

export const ddbRepo = new DynamoDBRepository();

export { marshall, unmarshall };
