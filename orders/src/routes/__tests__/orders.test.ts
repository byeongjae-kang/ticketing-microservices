import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { URL } from './new.test';

describe('orders', () => {
  it('returns orders for an particular user', async () => {
    const tickets = await Ticket.insertMany([
      {
        price: 10,
        title: 'title',
        version: 1
      },
      {
        price: 20,
        title: 'title2',
        version: 1
      },
      {
        price: 20,
        title: 'title3',
        version: 1
      }
    ]);
    const cookie1 = global.signin();
    const cookie2 = global.signin();

    await request(app)
      .post(URL)
      .set('Cookie', cookie1)
      .send({ ticketId: tickets[0]._id });

    await request(app)
      .post(URL)
      .set('Cookie', cookie2)
      .send({
        ticketId: tickets[1]._id
      })
      .expect(201);
    await request(app)
      .post(URL)
      .set('Cookie', cookie2)
      .send({
        ticketId: tickets[2]._id
      })
      .expect(201);

    const res = await request(app)
      .get(URL)
      .set('Cookie', cookie2)
      .send({})
      .expect(200);

    expect(res.body.length).toEqual(2);
    expect(res.body[0].ticket.title).toEqual('title2');
    expect(res.body[1].ticket.title).toEqual('title3');
  });
});
