import { TicketUpdatedEvent } from '@bk0719/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  const subscription = new TicketUpdatedListener(natsWrapper.client);

  const ticket = await Ticket.build({
    id: new Types.ObjectId(),
    title: 'testing listener',
    price: 1000
  });
  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'new testing listener',
    price: ticket.price,
    version: ticket.version + 1,
    useId: new Types.ObjectId()
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
  expect(ticket!.version).toEqual(data.version);
});

it('ack the message', async () => {
  const { subscription, data, msg } = await setup();
  await subscription.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a future skipped version number', async () => {
  const { subscription, data, msg } = await setup();
  data.version = 10;

  try {
    await subscription.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
