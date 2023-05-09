import request from 'supertest';
import { app } from '../../app';
import { URL } from './new.test';
import { Types } from 'mongoose';
import { Ticket } from '../../models/ticket';

describe('show', () => {
  it('returns a 404 if the ticket is not found', async () => {
    const randomId = new Types.ObjectId();
    await request(app)
      .get(`${URL}/${randomId}`)
      .set('Cookie', global.signin())
      .send()
      .expect(404);
  });

  it('can only be accessed if the user is signed in', async () => {
    const randomId = new Types.ObjectId();
    await request(app).get(`${URL}/${randomId}`).send({}).expect(401);
  });

  it('returns a status other than 401 if the user is signed in ', async () => {
    const randomId = new Types.ObjectId();
    const response = await request(app)
      .get(`${URL}/${randomId}`)
      .set('Cookie', global.signin())
      .send({});
    expect(response.status).not.toEqual(401);
  });

  it('returns a 200 and order', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 12,
      id: new Types.ObjectId()
    });
    await ticket.save();
    const user = global.signin();

    const createResponse = await request(app)
      .post(URL)
      .set('Cookie', user)
      .send({
        ticketId: ticket.id
      })
      .expect(201);

    const orderId = createResponse.body.id;

    const getResponse = await request(app)
      .get(`${URL}/${orderId}`)
      .set('Cookie', user)
      .send()
      .expect(200);

    expect(orderId).toEqual(getResponse.body.id);
  });

  it('returns an error if order does not exists', async () => {
    await request(app)
      .get(`${URL}/${new Types.ObjectId()}`)
      .set('Cookie', global.signin())
      .send()
      .expect(404);
  });

  it('returns an error if order is created by someone else', async () => {
    const ticket = Ticket.build({
      title: 'concert',
      price: 12,
      id: new Types.ObjectId()
    });
    await ticket.save();
    const user = global.signin();
    const user2 = global.signin();

    const createResponse = await request(app)
      .post(URL)
      .set('Cookie', user)
      .send({
        ticketId: ticket.id
      })
      .expect(201);

    const orderId = createResponse.body.id;

    await request(app)
      .get(`${URL}/${orderId}`)
      .set('Cookie', user2)
      .send()
      .expect(401);
  });
});
