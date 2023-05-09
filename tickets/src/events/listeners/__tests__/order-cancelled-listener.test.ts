import { OrderCancelledEvent, OrderStatus } from '@bk0719/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  const subscription = new OrderCancelledListener(natsWrapper.client);

  const orderId = new Types.ObjectId();
  const ticket = Ticket.build({
    price: 20,
    title: 'testing order cancelled listener',
    userId: new Types.ObjectId()
  });
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id
    }
  };

  const msg = { ack: jest.fn() } as unknown as Message;

  return { subscription, ticket, data, msg };
};

it('cancel and saves a ticket, ack the message, and publishes a event', async () => {
  const { subscription, ticket, data, msg } = await setup();
  await subscription.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.id).toEqual(ticket.id);
  expect(updatedTicket!.orderId).toBeUndefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
