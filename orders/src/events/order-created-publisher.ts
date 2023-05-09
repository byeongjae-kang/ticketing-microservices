import { Publisher, OrderCreatedEvent, Subjects } from '@bk0719/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
