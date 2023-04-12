import '../utils/setup';
import { createCarHandler, getCarHandler } from '../../handlers/cars.handler';
import { gatewayEvent, getNewCar } from '../data/create-car.data';

jest.setTimeout(10 * 1000);

const carTestData = getNewCar();

describe('Get car from the database', () => {
  test('Add car to the database - passed successfully', async () => {
    gatewayEvent.body = JSON.stringify(carTestData);
    const response = await createCarHandler(gatewayEvent);
    expect(response.statusCode).toEqual(201);
  });

  test('Fetch car from the database using wrong registration number', async () => {
    gatewayEvent.pathParameters = {
      carId: `asdasdas-adsa`,
    };
    const response = await getCarHandler(gatewayEvent);
    expect(response.statusCode).toEqual(404);
  });

  test('Fetch car from the database using correct registration number', async () => {
    gatewayEvent.pathParameters = {
      carId: carTestData.registerNumber,
    };
    const response = await getCarHandler(gatewayEvent);
    expect(response.statusCode).toEqual(200);
  });
});
