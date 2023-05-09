import { ExpirationCompletedEvent, Publisher, Subjects } from '@bk0719/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationCompleted;
}
