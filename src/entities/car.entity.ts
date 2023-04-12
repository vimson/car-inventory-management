import { Car } from '../types/schema.types';

class CarEntity {
  id: string;
  dealer: string;
  make: string;
  model: string;
  year: number;
  color: string;
  price: number;
  registerNumber: string;
  mileage: number;
  description: string;
  registeredAt: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Car) {
    Object.assign(this, data);
  }
}

export { CarEntity };
