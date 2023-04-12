import '../utils/setup';
import { createCarHandler, removeCarHandler } from '../../handlers/cars.handler';
import { gatewayEvent, getNewCar } from '../data/create-car.data';

jest.setTimeout(10 * 1000);

const carTestData = getNewCar();

describe('Get car from the database', () => {
  test('Add car to the database - passed successfully', async () => {
    gatewayEvent.body = JSON.stringify(carTestData);
    const response = await createCarHandler(gatewayEvent);
    expect(response.statusCode).toEqual(201);
  });

  test('Delete a car without passing the registration number', async () => {
    gatewayEvent.pathParameters = {};
    const response = await removeCarHandler(gatewayEvent);
    expect(response.statusCode).toEqual(400);
  });

  test('Delete a car that is a non-existing record in database', async () => {
    gatewayEvent.pathParameters = {
      carId: `asdasdas-adsa`,
    };
    const response = await removeCarHandler(gatewayEvent);
    expect(response.statusCode).toEqual(404);
  });

  test('Delete a car from the database with proper registration number', async () => {
    gatewayEvent.pathParameters = {
      carId: carTestData.registerNumber,
    };
    const response = await removeCarHandler(gatewayEvent);
    expect(response.statusCode).toEqual(200);
  });
});
