import request from 'supertest';
import { app } from '../../app';
import { URL } from './new.test';
import { Types } from 'mongoose';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@bk0719/common';
import { natsWrapper } from '../../nats-wrapper';

describe('show', () => {
  it('returns a 404 if the ticket is not found', async () => {
    const randomId = new Types.ObjectId();
    await request(app)
      .patch(`${URL}/${randomId}`)
      .set('Cookie', global.signin())
      .send()
      .expect(404);
  });

  it('can only be accessed if the user is signed in', async () => {
    const randomId = new Types.ObjectId();
    await request(app).patch(`${URL}/${randomId}`).send({}).expect(401);
  });

  it('returns a status other than 401 if the user is signed in ', async () => {
    const randomId = new Types.ObjectId();
    const response = await request(app)
      .patch(`${URL}/${randomId}`)
      .set('Cookie', global.signin())
      .send({});
    expect(response.status).not.toEqual(401);
  });

  it('returns a 200 and patched order', async () => {
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

    const patchResponse = await request(app)
      .patch(`${URL}/${orderId}`)
      .set('Cookie', user)
      .send()
      .expect(201);

    expect(patchResponse.body.status).toEqual(OrderStatus.Cancelled);
  });

  it('returns an error if order does not exists', async () => {
    await request(app)
      .patch(`${URL}/${new Types.ObjectId()}`)
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
      .patch(`${URL}/${orderId}`)
      .set('Cookie', user2)
      .send()
      .expect(401);
  });

  it('publishes an event', async () => {
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

    const patchResponse = await request(app)
      .patch(`${URL}/${orderId}`)
      .set('Cookie', user)
      .send()
      .expect(201);

    expect(patchResponse.body.status).toEqual(OrderStatus.Cancelled);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
