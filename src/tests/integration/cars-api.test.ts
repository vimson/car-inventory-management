import '../utils/setup';
import superagent from 'superagent';

jest.setTimeout(10 * 1000);

describe('Dealers - Cars manager', () => {
  test.skip('Adding a car to the database', async () => {
    const response = await superagent
      .post('https://132zhwbodb.execute-api.eu-west-2.amazonaws.com/prod/cars')
      .send({
        make: 'Toyota',
        model: 'Prius',
        year: 2018,
        color: 'Red',
        price: 100000,
        registeredAt: '2017-12-10',
        registerNumber: '123456789',
        mileage: 1000000,
        description: 'This is a test car',
      })
      .set('Authorization', 'Bearer: hello-token')
      .end();
    console.log(response);
  });

  test('Updating car inventory', async () => {
    const response = await superagent
      .put('https://i2zy5ooigb.execute-api.eu-west-2.amazonaws.com/prod/cars/KZM GLEH')
      .send({
        status: 'published',
      })
      .set('Authorization', 'Bearer: hello-token')
      .end();
    console.log(response);
  });
});
