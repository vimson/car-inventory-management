import '../utils/setup';
import { createCarHandler, getCarHandler } from '../../handlers/cars.handler';
import { gatewayEvent, gatewayGetCarEvent, sampleCars } from '../data/create-car.data';

jest.setTimeout(10 * 1000);

describe('Dealers - Cars manager', () => {
  test.skip('Adding a car to the database', async () => {
    const response = await createCarHandler(gatewayEvent);
    console.log(response);
    expect(response.statusCode).toBe(201);
  });

  test.skip('Adding batch of cars to the database', async () => {
    for (const car of sampleCars) {
      gatewayEvent.body = JSON.stringify(car);
      const response = await createCarHandler(gatewayEvent);
      console.log(response);
      expect(response.statusCode).toBeTruthy();
    }
  });

  test('Get individual car from registration number', async () => {
    const response = await getCarHandler(gatewayGetCarEvent);
    console.log(response);
    expect(response.statusCode).toBe(200);
  });
});
