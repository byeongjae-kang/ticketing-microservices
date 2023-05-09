import {
  ExpirationCompletedEvent,
  Listener,
  NotFoundError,
  OrderStatus,
  Subjects
} from '@bk0719/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../order-cancelled-publisher';

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationCompleted;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompletedEvent['data'], message: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id
      },
      version: order.version
    });

    message.ack();
  }
}
