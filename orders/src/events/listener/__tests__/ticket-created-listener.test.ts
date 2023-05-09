import { TicketCreatedEvent } from '@bk0719/common';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const subscription = new TicketCreatedListener(natsWrapper.client);

  const data: TicketCreatedEvent['data'] = {
    id: new Types.ObjectId(),
    title: 'testing listener',
    price: 1000,
    version: 0,
    userId: new Types.ObjectId()
  };

  const msg = { ack: jest.fn() } as unknown as Message;

  return { subscription, data, msg };
};

it('creates and saves a ticket', async () => {
  const { subscription, data, msg } = await setup();
  await subscription.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('ack the message', async () => {
  const { subscription, data, msg } = await setup();
  await subscription.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
