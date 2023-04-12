import '../utils/setup';
import { carsHandler, createCarHandler } from '../../handlers/cars.handler';
import { gatewayEvent, carSearchEvent, sampleCars } from '../data/create-car.data';
import { CarSearchParams } from '../../types/schema.types';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { parseJson } from '../../utils/generic.utils';

jest.setTimeout(10 * 1000);

describe('Dealers - Cars manager', () => {
  test('Cars listing from a dealer with sort by descending order of the post', async () => {
    const searchParams: CarSearchParams = {
      dealer: 'Car Traders',
      sortBy: 'desc',
      limit: 25,
    };
    carSearchEvent.queryStringParameters =
      searchParams as unknown as APIGatewayProxyEventQueryStringParameters;

    const response = await carsHandler(carSearchEvent);
    const responseBody = parseJson(response.body);
    expect(responseBody.results[0].dealer).toEqual(searchParams.dealer);
    expect(response.statusCode).toBe(200);
  });

  test('Cars listing filtered by make', async () => {
    const searchParams: CarSearchParams = {
      make: 'Toyota',
      sortBy: 'desc',
      limit: 25,
    };
    carSearchEvent.queryStringParameters =
      searchParams as unknown as APIGatewayProxyEventQueryStringParameters;

    const response = await carsHandler(carSearchEvent);
    const responseBody = parseJson(response.body);
    expect(responseBody.results[0].make).toEqual(searchParams.make);
    expect(response.statusCode).toBe(200);
  });

  test('Cars listing filtered by make and model', async () => {
    const searchParams: CarSearchParams = {
      make: 'Toyota',
      model: 'Highlander',
      sortBy: 'desc',
      limit: 25,
    };
    carSearchEvent.queryStringParameters =
      searchParams as unknown as APIGatewayProxyEventQueryStringParameters;

    const response = await carsHandler(carSearchEvent);
    const responseBody = parseJson(response.body);
    expect(responseBody.results[0].make).toEqual(searchParams.make);
    expect(responseBody.results[0].model).toEqual(searchParams.model);
    expect(response.statusCode).toBe(200);
  });

  test('Cars those are registered before 2022-06-01', async () => {
    const searchParams: CarSearchParams = {
      registeredBefore: '2022-06-01',
      sortBy: 'desc',
      limit: 25,
    };
    carSearchEvent.queryStringParameters =
      searchParams as unknown as APIGatewayProxyEventQueryStringParameters;
    const response = await carsHandler(carSearchEvent);
    expect(response.statusCode).toBe(200);
  });

  test('Cars those are registered after 2022-06-01', async () => {
    const searchParams: CarSearchParams = {
      registeredAfter: '2022-06-01',
      sortBy: 'desc',
      limit: 25,
    };
    carSearchEvent.queryStringParameters =
      searchParams as unknown as APIGatewayProxyEventQueryStringParameters;
    const response = await carsHandler(carSearchEvent);
    expect(response.statusCode).toBe(200);
  });

  test('Cars those are registered after 2022-06-01 and before 2022-06-01', async () => {
    const searchParams: CarSearchParams = {
      registeredAfter: '2022-06-01',
      registeredBefore: '2022-06-01',
      sortBy: 'asc',
      limit: 25,
    };
    carSearchEvent.queryStringParameters =
      searchParams as unknown as APIGatewayProxyEventQueryStringParameters;
    const response = await carsHandler(carSearchEvent);
    expect(response.statusCode).toBe(200);
  });

  test.skip('Adding batch of cars to the database', async () => {
    for (const car of sampleCars) {
      gatewayEvent.body = JSON.stringify(car);
      const response = await createCarHandler(gatewayEvent);
      expect(response.statusCode).toBeTruthy();
    }
  });
});
