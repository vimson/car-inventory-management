import '../utils/setup';
import { createCarHandler, updateCarHandler } from '../../handlers/cars.handler';
import { gatewayEvent, getNewCar } from '../data/create-car.data';

jest.setTimeout(10 * 1000);

const carTestData = getNewCar();

describe('Get car from the database', () => {
  test('Add car to the database - passed successfully', async () => {
    gatewayEvent.body = JSON.stringify(carTestData);
    const response = await createCarHandler(gatewayEvent);
    expect(response.statusCode).toEqual(201);
  });

  test('Updating the car without passing the registration number', async () => {
    gatewayEvent.body = '{"status":"published"}';
    gatewayEvent.pathParameters = {};
    const response = await updateCarHandler(gatewayEvent);
    expect(response.statusCode).toEqual(400);
  });

  test('Trying to update a non-existing record in database', async () => {
    gatewayEvent.body = '{"status":"published"}';
    gatewayEvent.pathParameters = {
      carId: `asdasdas-adsa`,
    };
    const response = await updateCarHandler(gatewayEvent);
    expect(response.statusCode).toEqual(404);
  });

  test('Update status of the car with proper registration number', async () => {
    gatewayEvent.body = '{"status":"published"}';
    gatewayEvent.pathParameters = {
      carId: carTestData.registerNumber,
    };
    const response = await updateCarHandler(gatewayEvent);
    expect(response.statusCode).toEqual(200);
  });
});
