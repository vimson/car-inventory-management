import { ddbRepo } from '../repositories/base/dynamodb.base.repo';
import { CarEntity } from '../entities/car.entity';
import { Car, CarPutRequest } from '../types/schema.types';
import omit from 'lodash.omit';

class CarsRepo {
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
          LSI2_SK: `car#${car.dealer}#${car.createdAt}`,
          LSI3_SK: `car#${car.make}#${car.model}#${car.createdAt}`,
          LSI4_SK: `car#${car.registeredAt}`,
          LSI5_SK: `car#${car.make}#${car.model}#${car.price}`,
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
    return omit(carDocument, ['PK', 'SK', 'LSI1_SK', 'LSI2_SK', 'LSI3_SK', 'LSI4_SK', 'LSI5_SK']);
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

    return omit(updatedItem, ['PK', 'SK', 'LSI1_SK', 'LSI2_SK', 'LSI3_SK', 'LSI4_SK', 'LSI5_SK']);
  }
}

export const carsRepo = new CarsRepo();
