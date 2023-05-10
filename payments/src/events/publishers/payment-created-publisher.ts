import { PaymentCreatedEvent, Publisher, Subjects } from '@bk0719/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
