import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorHandler } from '../middlewares/error.middleware';
import {
  carRequestSchema,
  carPutRequestSchema,
  carSearchSchema,
  CarSearchParams,
} from '../types/schema.types';
import { parseJson, buildResponse } from '../utils/generic.utils';
import { CarsFactory } from '../factories/cars.factory';
import { carsRepo } from '../repositories/cars.repo';

// Get Cars from DB
export const cars = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const searchParams: CarSearchParams | null = event.queryStringParameters;
  carSearchSchema.parse(searchParams);

  const result = await carsRepo.searchcars(searchParams);
  return buildResponse(200, result);
};

export const carsHandler = errorHandler()(cars);

// Get a single car
const getCar = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const carRegistrationNumber = event?.pathParameters?.carId
    ? decodeURI(event.pathParameters.carId)
    : null;
  if (!carRegistrationNumber) {
    return buildResponse(400, { message: 'Bad Request | Car registration number must provide' });
  }

  const car = await carsRepo.getCarByRegistrationNumber(carRegistrationNumber);
  if (!car) {
    return buildResponse(404, { message: 'Not Found | Car not found' });
  }

  return buildResponse(200, car);
};
export const getCarHandler = errorHandler()(getCar);

// Create a new Car
export const createCar = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const carData = event.body ? parseJson(event.body) : {};
  carRequestSchema.parse(carData);
  const carEntity = CarsFactory.buildCar(carData);
  const carExists = await carsRepo.exists(carEntity.registerNumber);
  if (carExists) {
    return buildResponse(409, { message: 'Conflict | Car already exists' });
  }

  await carsRepo.saveCar(carEntity);
  return buildResponse(201, {
    message: 'Created | Car added to the database',
  });
};
export const createCarHandler = errorHandler()(createCar);

// Update an existing Car
export const updateCar = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const carData = event.body ? parseJson(event.body) : {};
  const carRegistrationNumber = event?.pathParameters?.carId
    ? decodeURI(event.pathParameters.carId)
    : null;

  if (!carRegistrationNumber) {
    return buildResponse(400, { message: 'Bad Request | Car registration number must provide' });
  }
  carPutRequestSchema.parse(carData);

  const carExists = await carsRepo.exists(carRegistrationNumber);
  if (!carExists) {
    return buildResponse(404, { message: 'Not Found | Car not found' });
  }

  const updatedCar = await carsRepo.updateCar(carRegistrationNumber, carData);
  if (!updatedCar) {
    return buildResponse(304, { message: 'Nothing to update' });
  }

  return buildResponse(200, updatedCar);
};
export const updateCarHandler = errorHandler()(updateCar);

// Remove an existing Car
export const removeCar = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const carRegistrationNumber = event?.pathParameters?.carId
    ? decodeURI(event.pathParameters.carId)
    : null;
  if (!carRegistrationNumber) {
    return buildResponse(400, { message: 'Bad Request | Car registration number must provide' });
  }

  const car = await carsRepo.getCarByRegistrationNumber(carRegistrationNumber);
  if (!car) {
    return buildResponse(404, { message: 'Not Found | Car not found' });
  }
  await carsRepo.removeCarByRegistrationNumber(carRegistrationNumber);
  return buildResponse(200, { message: 'Car deleted' });
};
export const removeCarHandler = errorHandler()(removeCar);
