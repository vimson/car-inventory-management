import '../utils/setup';
import {
  carsHandler,
  createCarHandler,
  getCarHandler,
  removeCarHandler,
  updateCarHandler,
} from '../../handlers/cars.handler';
import {
  gatewayEvent,
  gatewayGetCarEvent,
  putCarGatewayEvent,
  carSearchEvent,
  sampleCars,
} from '../data/create-car.data';

jest.setTimeout(10 * 1000);

describe('Dealers - Cars manager', () => {
  test.skip('Adding batch of cars to the database', async () => {
    for (const car of sampleCars) {
      gatewayEvent.body = JSON.stringify(car);
      const response = await createCarHandler(gatewayEvent);
      expect(response.statusCode).toBeTruthy();
    }
  });

  test.skip('Get car from the database by registration number', async () => {
    const response = await getCarHandler(gatewayGetCarEvent);
    expect(response.statusCode).toBe(200);
  });

  test.skip('Remove car from the database by registration number', async () => {
    const response = await removeCarHandler(gatewayGetCarEvent);
    expect(response.statusCode).toBe(200);
  });

  test.skip('Update car inventory in the database', async () => {
    const response = await updateCarHandler(putCarGatewayEvent);
    expect(response.statusCode).toBe(200);
  });

  test('Cars listing', async () => {
    const response = await carsHandler(carSearchEvent);
    console.log(response.body);

    expect(response.statusCode).toBe(200);
  });
});
