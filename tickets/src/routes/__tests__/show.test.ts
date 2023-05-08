import request from 'supertest';
import { app } from '../../app';
import { URL } from './new.test';
import { Types } from 'mongoose';

describe('show', () => {
  it('returns a 404 if the ticket is not found', async () => {
    const randomId = new Types.ObjectId();
    await request(app)
      .get(`${URL}/${randomId}`)
      .set('Cookie', global.signin())
      .send()
      .expect(404);
  });
  it('returns a 200 and ticket if the ticket is  found', async () => {
    const title = 'title';
    const price = 20;

    const createNewResponse = await request(app)
      .post(URL)
      .set('Cookie', global.signin())
      .send({ title, price })
      .expect(201);

    const id = createNewResponse.body.id;

    const response = await request(app)
      .get(`${URL}/${id}`)
      .set('Cookie', global.signin())
      .send()
      .expect(200);

    expect(response.body.title).toEqual(title);
    expect(response.body.price).toEqual(price);
  });
});
