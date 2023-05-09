import { Listener, Subjects, TicketCreatedEvent } from '@bk0719/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], message: Message) {
    const { id, price, title } = data;

    const ticket = Ticket.build({
      id,
      price,
      title,
      version: message.getSequence()
    });

    try {
      await ticket.save();
      message.ack();
    } catch (err) {
      console.log('Could not save it into db');
    }
  }
}
