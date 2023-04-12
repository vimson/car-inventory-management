import omit from 'lodash.omit';
import {
  ddbRepo,
  unmarshall,
  QueryCommandInput,
  AttributeValue,
} from '../repositories/base/dynamodb.base.repo';
import { CarEntity } from '../entities/car.entity';
import { Car, CarPutRequest, CarSearchParams, SearchResult } from '../types/schema.types';
class CarsRepo {
  private privateFields = ['PK', 'SK', 'LSI1_SK', 'LSI2_SK', 'LSI3_SK', 'LSI4_SK', 'LSI5_SK'];

  async exists(registrationNumber: string): Promise<boolean> {
    const document = await ddbRepo.getItemByKey<Car>('Car', registrationNumber);
    return document ? true : false;
  }

  async saveCar(car: CarEntity) {
    const ddbEntity = ddbRepo.formatToDDBEntity(
      Object.assign(
        {},
        {
          ...car,
          PK: 'Car',
          SK: car.registerNumber,
          LSI1_SK: car.createdAt,
          LSI2_SK: `${car.dealer}#${car.createdAt}`,
          LSI3_SK: `${car.make}#${car.model}#${car.createdAt}`,
          LSI4_SK: `${car.registeredAt}`,
          LSI5_SK: `${car.make}#${car.model}#${car.price}`,
        }
      )
    );
    await ddbRepo.save(ddbEntity);
  }

  async getCarByRegistrationNumber(registrationNumber: string): Promise<Car | null> {
    const carDocument = await ddbRepo.getItemByKey<Car>('Car', registrationNumber);
    if (!carDocument) {
      return null;
    }
    return omit(carDocument, [...this.privateFields]);
  }

  async removeCarByRegistrationNumber(registrationNumber: string): Promise<boolean> {
    return await ddbRepo.deleteByKey('Car', registrationNumber);
  }

  async updateCar(registrationNumber: string, data: CarPutRequest): Promise<Car | null> {
    data['updatedAt'] = new Date().toISOString();
    const fieldKeys = Object.keys(data);
    if (fieldKeys.length === 1) {
      return null;
    }

    const updatedItem = await ddbRepo.updateDocument<CarPutRequest>(
      'Car',
      registrationNumber,
      data,
      fieldKeys
    );

    if (!updatedItem) {
      return null;
    }

    return omit(updatedItem, [...this.privateFields]);
  }

  async searchcars(parameters: CarSearchParams | null): Promise<SearchResult> {
    const searchOptions = this.getSearchOptions(parameters);
    const result = await ddbRepo.find(searchOptions);

    const searchResult: SearchResult = {};
    if (result?.Items) {
      searchResult.results = result.Items.map((item: any) => {
        return omit(unmarshall(item), [...this.privateFields]) as Car;
      });

      if (result?.LastEvaluatedKey) {
        searchResult.nextPageOffset = encodeURIComponent(JSON.stringify(result.LastEvaluatedKey));
      }
    }

    return searchResult;
  }

  getSearchOptions(parameters: CarSearchParams | null) {
    const expressionAttributeValues: Record<string, AttributeValue> = {
      ':pk': { S: 'Car' },
    };

    const searchOptions: QueryCommandInput = {
      ExpressionAttributeValues: expressionAttributeValues,
      KeyConditionExpression: 'PK = :pk',
      TableName: process.env.DEALERS_TABLE,
      ScanIndexForward: parameters?.sortBy === 'asc' ? true : false,
      Limit: parameters?.limit || 10,
    };

    if (parameters?.dealer) {
      searchOptions['KeyConditionExpression'] = 'PK = :pk AND begins_with (LSI2_SK , :dealer)';
      expressionAttributeValues[':dealer'] = { S: `${parameters.dealer}` };
      searchOptions['IndexName'] = 'LSI2';
    }

    if (parameters?.make && parameters?.model) {
      searchOptions['KeyConditionExpression'] = 'PK = :pk AND begins_with (LSI3_SK , :makeModel)';
      expressionAttributeValues[':makeModel'] = { S: `${parameters.make}#${parameters.model}` };
      searchOptions['IndexName'] = 'LSI3';
    } else if (parameters?.make) {
      searchOptions['KeyConditionExpression'] = 'PK = :pk AND begins_with (LSI3_SK , :make)';
      expressionAttributeValues[':make'] = { S: `${parameters.make}` };
      searchOptions['IndexName'] = 'LSI3';
    }

    if (parameters?.registeredAfter && parameters?.registeredBefore) {
      searchOptions['KeyConditionExpression'] =
        'PK = :pk AND LSI4_SK BETWEEN :registeredAfter AND :registeredBefore';
      expressionAttributeValues[':registeredAfter'] = { S: `${parameters.registeredAfter}` };
      expressionAttributeValues[':registeredBefore'] = { S: `${parameters.registeredBefore}` };
      searchOptions['IndexName'] = 'LSI4';
    } else if (parameters?.registeredAfter) {
      searchOptions['KeyConditionExpression'] = 'PK = :pk AND LSI4_SK >= :registeredAfter';
      expressionAttributeValues[':registeredAfter'] = { S: `${parameters.registeredAfter}` };
      searchOptions['IndexName'] = 'LSI4';
    } else if (parameters?.registeredBefore) {
      searchOptions['KeyConditionExpression'] = 'PK = :pk AND LSI4_SK <= :registeredBefore';
      expressionAttributeValues[':registeredBefore'] = { S: `${parameters.registeredBefore}` };
      searchOptions['IndexName'] = 'LSI4';
    }

    return searchOptions;
  }
}

export const carsRepo = new CarsRepo();
