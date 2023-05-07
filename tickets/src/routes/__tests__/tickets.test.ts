import request from 'supertest';
import { app } from '../../app';
import { URL } from './new.test';

describe('tickets', () => {
  const createNewResponse = async () =>
    await request(app)
      .post(URL)
      .set('Cookie', global.signin())
      .send({ title: 'title', price: 20 })
      .expect(201);

  it('should return all tickets', async () => {
    await createNewResponse();
    await createNewResponse();
    await createNewResponse();
    await createNewResponse();
    await createNewResponse();

    const response = await request(app)
      .get(URL)
      .set('Cookie', global.signin())
      .send()
      .expect(200);
    expect(response.body.length).toEqual(5);
  });
});
