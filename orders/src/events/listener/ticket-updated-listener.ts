import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent
} from '@bk0719/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], message: Message) {
    const { id, price, title } = data;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set({ price, title });

    try {
      await ticket.save();
      message.ack();
    } catch (err) {
      console.log('Could not save it into db');
    }
  }
}
