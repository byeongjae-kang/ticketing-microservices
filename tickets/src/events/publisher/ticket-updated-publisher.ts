import { Publisher, Subjects, TicketUpdatedEvent } from '@bk0719/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
