import { OrderCreatedEvent, OrderStatus } from '@bk0719/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {
  const subscription = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    price: 20,
    title: 'testing order created listener',
    userId: new Types.ObjectId()
  });
  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    status: OrderStatus.Created,
    version: 0,
    expiresAt: new Date().toLocaleString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  };

  const msg = { ack: jest.fn() } as unknown as Message;

  return { subscription, ticket, data, msg };
};

it('creates and saves a ticket', async () => {
  const { subscription, ticket, data, msg } = await setup();
  await subscription.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.id).toEqual(ticket.id);
  expect(updatedTicket!.price).toEqual(ticket.price);
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('ack the message', async () => {
  const { subscription, data, msg } = await setup();
  await subscription.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { subscription, data, msg } = await setup();
  await subscription.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
