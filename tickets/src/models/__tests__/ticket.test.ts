import { Types } from 'mongoose';
import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  const ticket = Ticket.build({
    price: 10,
    title: 'concurrency',
    userId: new Types.ObjectId()
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance?.set({ price: 1 });
  secondInstance?.set({ price: 2 });

  await firstInstance?.save();
  try {
    await secondInstance?.save();
  } catch (err) {
    expect(err).toBeDefined();
    return;
  }

  throw new Error('should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    price: 10,
    title: 'another concurrency',
    userId: new Types.ObjectId()
  });

  await ticket.save();
  expect(ticket.version).toBe(0);
  await ticket.save();
  expect(ticket.version).toBe(1);
  await ticket.save();
  expect(ticket.version).toBe(2);
  await ticket.save();
  expect(ticket.version).toBe(3);
});
