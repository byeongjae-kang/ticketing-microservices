import request from 'supertest';
import { app } from '../../app';
import { URL } from './new.test';
import { Types } from 'mongoose';

describe('update ticket', () => {
  it('returns 404 if the id provided does not exist', async () => {
    const randomId = new Types.ObjectId();
    await request(app)
      .put(`${URL}/${randomId}`)
      .set('Cookie', global.signin())
      .send({ title: 'title', price: 29 })
      .expect(404);
  });
  it('returns 401 if user is not authenticated', async () => {
    const randomId = new Types.ObjectId();
    await request(app)
      .put(`${URL}/${randomId}`)
      .send({ title: 'title', price: 29 })
      .expect(401);
  });
  it('returns 401 if current ticket is not owned by current user', async () => {
    const response = await request(app)
      .post(URL)
      .send({ title: 'title', price: 29 })
      .set('Cookie', global.signin())
      .expect(201);

    const id = response.body.id;

    await request(app)
      .put(`${URL}/${id}`)
      .set('Cookie', global.signin())
      .send({ title: 'title', price: 300 })
      .expect(401);
  });
  it('returns 400 if user provide invalid title or price', async () => {
    const cookie = global.signin();
    const response = await request(app)
      .post(URL)
      .send({ title: 'title', price: 29 })
      .set('Cookie', cookie)
      .expect(201);

    const id = response.body.id;

    await request(app)
      .put(`${URL}/${id}`)
      .set('Cookie', cookie)
      .send({ price: 300 })
      .expect(400);
    await request(app)
      .put(`${URL}/${id}`)
      .set('Cookie', cookie)
      .send({ title: '', price: 300 })
      .expect(400);

    await request(app)
      .put(`${URL}/${id}`)
      .set('Cookie', cookie)
      .send({ title: 'title' })
      .expect(400);

    await request(app)
      .put(`${URL}/${id}`)
      .set('Cookie', cookie)
      .send({ title: 'title', price: -20 })
      .expect(400);
  });
  it('updates the ticket with valid inputs', async () => {
    const cookie = global.signin();
    const response = await request(app)
      .post(URL)
      .send({ title: 'title', price: 29 })
      .set('Cookie', cookie)
      .expect(201);

    const id = response.body.id;
    const newTitle = 'new title';
    const newPrice = 1000;

    const updateResponse = await request(app)
      .put(`${URL}/${id}`)
      .set('Cookie', cookie)
      .send({ title: newTitle, price: newPrice })
      .expect(201);

    expect(updateResponse.body.title).toEqual(newTitle);
    expect(updateResponse.body.price).toEqual(newPrice);
  });
});
