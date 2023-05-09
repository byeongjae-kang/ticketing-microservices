import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Types } from 'mongoose';
import { OrderStatus } from '@bk0719/common';
import { natsWrapper } from '../../nats-wrapper';

export const URL = '/api/orders';

describe('new', () => {
  it('reserves the ticket', async () => {
    const ticket = Ticket.build({ price: 200, title: 'title1234', version: 1 });
    await ticket.save();

    const response = await request(app)
      .post(URL)
      .set('Cookie', global.signin())
      .send({
        ticketId: ticket._id
      })
      .expect(201);

    expect(response.body.userId).toBeDefined();
    expect(response.body.expiresAt).toBeDefined();
    expect(response.body.status).toEqual(OrderStatus.Created);
    expect(response.body.ticket.title).toEqual('title1234');
    expect(response.body.ticket.price).toEqual(200);
    expect(response.body.ticket.version).toEqual(1);
  });

  it('has a route handler listening to /api/orders for post requests', async () => {
    const response = await request(app).post(URL).send({});
    expect(response.status).not.toEqual(404);
  });
  it('can only be accessed if the user is signed in', async () => {
    await request(app).post(URL).send({}).expect(401);
  });
  it('returns a status other than 401 if the user is signed in ', async () => {
    const response = await request(app)
      .post(URL)
      .set('Cookie', global.signin())
      .send({});
    expect(response.status).not.toEqual(401);
  });
  it('returns an error if an invalid ticketId is provided', async () => {
    await request(app)
      .post(URL)
      .set('Cookie', global.signin())
      .send({
        ticketId: 'invalid id'
      })
      .expect(400);
  });
  it('returns an error if the ticket does not exist', async () => {
    await request(app)
      .post(URL)
      .set('Cookie', global.signin())
      .send({
        ticketId: new Types.ObjectId()
      })
      .expect(404);
  });

  it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({ price: 10, title: 'ticket', version: 1 });
    await ticket.save();

    const res = await request(app)
      .post(URL)
      .set('Cookie', global.signin())
      .send({
        ticketId: ticket._id
      })
      .expect(201);

    await request(app)
      .post(URL)
      .set('Cookie', global.signin())
      .send({
        ticketId: ticket._id
      })
      .expect(400);
  });

  it('publishes an event', async () => {
    const ticket = Ticket.build({
      price: 10,
      title: 'check if even is emitted',
      version: 1
    });
    await ticket.save();
    await request(app)
      .post(URL)
      .set('Cookie', global.signin())
      .send({
        ticketId: ticket._id
      })
      .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
