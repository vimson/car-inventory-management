import { CarEntity } from '../entities/car.entity';
import { CarPostRequest, Car } from '../types/schema.types';

class CarsFactory {
  static buildCar(car: CarPostRequest): CarEntity {
    const addedTime = new Date().toISOString();
    const carInfo: Car = {
      id: car.registerNumber,
      ...car,
      status: 'draft',
      createdAt: addedTime,
      updatedAt: addedTime,
    };
    return new CarEntity(carInfo);
  }
}

export { CarsFactory };
