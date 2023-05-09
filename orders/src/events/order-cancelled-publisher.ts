import { Publisher, OrderCancelledEvent, Subjects } from '@bk0719/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
