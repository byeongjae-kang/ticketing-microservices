import request from 'supertest';
import { app } from '../../app';
import { Types } from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@bk0719/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';
import { natsWrapper } from '../../nats-wrapper';

const URL = '/api/payments';
jest.mock('../../stripe.ts');

it('returns 404 when purchasing order that does not exist', async () => {
  await request(app)
    .post(URL)
    .set('Cookie', global.signin())
    .send({
      orderId: new Types.ObjectId().toString(),
      token: 'token'
    })
    .expect(404);
});
it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: new Types.ObjectId(),
    price: 20,
    status: OrderStatus.Created,
    userId: new Types.ObjectId(),
    version: 0
  });

  await order.save();

  await request(app)
    .post(URL)
    .set('Cookie', global.signin())
    .send({
      orderId: order.id,
      token: 'token'
    })
    .expect(401);
});
it('returns a 400 when purchasing an cancelled order', async () => {
  const userId = new Types.ObjectId();

  const order = Order.build({
    id: new Types.ObjectId(),
    price: 20,
    status: OrderStatus.Cancelled,
    userId,
    version: 0
  });

  await order.save();

  await request(app)
    .post(URL)
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'token'
    })
    .expect(400);
});

it('returns a 201 with valid inputs and calls charge function', async () => {
  const userId = new Types.ObjectId();

  const order = Order.build({
    id: new Types.ObjectId(),
    price: 0.01,
    status: OrderStatus.Created,
    userId,
    version: 0
  });

  await order.save();
  await request(app)
    .post(URL)
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'tok_visa'
    })
    .expect(201);
  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: 'mock_id'
  });

  expect(payment).toBeDefined();
  expect(stripe.charges.create).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
