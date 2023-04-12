import '../utils/setup';
import { createCarHandler } from '../../handlers/cars.handler';
import { gatewayEvent, getNewCar } from '../data/create-car.data';
import { parseJson } from '../../utils/generic.utils';

jest.setTimeout(10 * 1000);

const carTestData = getNewCar();

describe('Car creation', () => {
  test('Add car with invalid data - failure with validation errors', async () => {
    gatewayEvent.body = JSON.stringify({});
    const response = await createCarHandler(gatewayEvent);
    const responseBody = parseJson(response.body);
    expect(responseBody.issues.length).toBeGreaterThan(0);
    expect(response.statusCode).toEqual(400);
  });

  test('Add car to the database - passed successfully', async () => {
    gatewayEvent.body = JSON.stringify(carTestData);
    const response = await createCarHandler(gatewayEvent);
    expect(response.statusCode).toEqual(201);
  });

  test('Add an exisitng car in the database again - failure', async () => {
    gatewayEvent.body = JSON.stringify(carTestData);
    const response = await createCarHandler(gatewayEvent);
    expect(response.statusCode).toEqual(409);
  });
});
