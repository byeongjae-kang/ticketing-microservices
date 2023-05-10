import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  OrderStatus,
  Subjects
} from '@bk0719/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], message: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1
    });

    if (!order) {
      throw new NotFoundError();
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    message.ack();
  }
}
