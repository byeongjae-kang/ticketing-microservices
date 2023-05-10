import { OrderCancelledEvent, OrderStatus } from '@bk0719/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  const subscription = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new Types.ObjectId(),
    price: 20,
    status: OrderStatus.Created,
    userId: new Types.ObjectId(),
    version: 0
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: new Types.ObjectId()
    }
  };

  const msg = { ack: jest.fn() } as unknown as Message;

  return { subscription, order, data, msg };
};

it('creates and saves order, ack the message, publishes an event', async () => {
  const { subscription, order, data, msg } = await setup();
  await subscription.onMessage(data, msg);

  const cancelledOrder = await Order.findById(order.id);

  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);

  expect(msg.ack).toHaveBeenCalled();
});
