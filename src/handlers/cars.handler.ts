import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorHandler } from '../middlewares/error.middleware';
import { carRequestSchema } from '../types/schema.types';
import { parseJson, buildResponse } from '../utils/generic.utils';
import { CarsFactory } from '../factories/cars.factory';
import { carsRepo } from '../repositories/cars.repo';

// Get Cars from DB
export const carsHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Cars landing page' + Math.random(),
    }),
  };
};

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
export const updateCarHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Update car' + Math.random(),
    }),
  };
};

// Remove an existing Car
export const removeCarHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'remove car' + Math.random(),
    }),
  };
};
