import { ExpirationCompletedEvent, OrderStatus } from '@bk0719/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { ExpirationCompletedListener } from '../expiration-completed-listener';
import { Order } from '../../../models/order';

const setup = async () => {
  const subscription = new ExpirationCompletedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new Types.ObjectId(),
    price: 20,
    title: 'expiration completed listener'
  });
  await ticket.save();

  const order = Order.build({
    expiresAt: new Date(),
    status: OrderStatus.Created,
    ticket: ticket.id,
    userId: new Types.ObjectId()
  });
  await order.save();

  const data: ExpirationCompletedEvent['data'] = {
    orderId: order.id
  };

  const msg = { ack: jest.fn() } as unknown as Message;

  return { subscription, ticket, order, data, msg };
};

it('update order status to cancelled, ack message, emit a event', async () => {
  const { subscription, data, msg } = await setup();
  await subscription.onMessage(data, msg);

  const order = await Order.findById(data.orderId);

  expect(order?.status).toEqual(OrderStatus.Cancelled);
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
