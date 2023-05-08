import { Publisher, TicketCreatedEvent, Subjects } from '@bk0719/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
