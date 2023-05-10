import { OrderCreatedEvent, OrderStatus } from '@bk0719/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedListener } from '../order-created-listener';
import { Order } from '../../../models/order';

const setup = async () => {
  const subscription = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    status: OrderStatus.Created,
    version: 0,
    expiresAt: new Date().toLocaleString(),
    ticket: {
      id: new Types.ObjectId(),
      price: 20
    }
  };

  const msg = { ack: jest.fn() } as unknown as Message;

  return { subscription, data, msg };
};

it('creates and saves order, ack the message, publishes an event', async () => {
  const { subscription, data, msg } = await setup();
  await subscription.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!._id).toEqual(data.id);
  expect(order!.price).toEqual(data.ticket.price);

  expect(msg.ack).toHaveBeenCalled();
});
