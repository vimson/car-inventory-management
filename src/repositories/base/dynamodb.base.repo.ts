import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import {
  DynamoDBClient,
  DynamoDBClientConfig,
  WriteRequest,
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
  QueryCommandInput,
  DeleteItemCommand,
  UpdateItemCommand,
  UpdateItemCommandOutput,
  AttributeValue,
} from '@aws-sdk/client-dynamodb';
import { ApiError } from '../../middlewares/error.middleware';

class DynamoDBRepository {
  private ddbClient: DynamoDBClient;

  constructor() {
    let config: DynamoDBClientConfig = {
      region: process.env.AWS_REGION,
    };

    if (process.env.environment === 'test') {
      config = Object.assign(config, {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_KEY,
        },
      });
    }
    this.ddbClient = new DynamoDBClient(config);
  }

  async save(document: any) {
    const params = {
      TableName: `${process.env.DEALERS_TABLE}`,
      Item: document,
    };
    await this.ddbClient.send(new PutItemCommand(params));
  }

  async find(searchOptions: QueryCommandInput) {
    try {
      const result = await this.ddbClient.send(new QueryCommand(searchOptions));
      return result;
    } catch (error) {
      console.log(error);
      throw new ApiError('Search params incomplete', 400);
    }
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

  async deleteByKey(partitionKey: string, sortKey: string): Promise<boolean> {
    const params = {
      TableName: process.env.DEALERS_TABLE,
      Key: marshall({
        PK: partitionKey,
        SK: sortKey,
      }),
    };

    await this.ddbClient.send(new DeleteItemCommand(params));
    return true;
  }

  async updateDocument<T>(partitionKey: string, sortKey: string, item: T, itemKeys: string[]) {
    const params = {
      TableName: process.env.DEALERS_TABLE,
      UpdateExpression: `SET ${itemKeys
        .map((k, index) => `#field${index} = :value${index}`)
        .join(', ')}`,
      ExpressionAttributeNames: itemKeys.reduce(
        (accumulator, k, index) => ({
          ...accumulator,
          [`#field${index}`]: k,
        }),
        {}
      ),
      ExpressionAttributeValues: marshall(
        itemKeys.reduce(
          (accumulator, k, index) => ({
            ...accumulator,
            [`:value${index}`]: item[k],
          }),
          {}
        )
      ),
      Key: marshall({
        PK: partitionKey,
        SK: sortKey,
      }),
      ReturnValues: 'ALL_NEW',
    };

    const updatedDocument: UpdateItemCommandOutput = await this.ddbClient.send(
      new UpdateItemCommand(params)
    );
    return updatedDocument.Attributes ? unmarshall(updatedDocument.Attributes) : null;
  }

  formatToDDBEntity(entity: Record<string, any>): WriteRequest {
    return marshall(entity);
  }
}

export const ddbRepo = new DynamoDBRepository();

export { marshall, unmarshall, QueryCommandInput, AttributeValue };
