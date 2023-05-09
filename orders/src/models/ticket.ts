import { OrderStatus } from '@bk0719/common';
import mongoose, { Types } from 'mongoose';
import { Order } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ITicket {
  id: Types.ObjectId;
  title: string;
  price: number;
}
export interface ITicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): boolean;
}

interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build(ticket: ITicket): ITicketDoc;
  findByEvent(event: {
    id: Types.ObjectId;
    version: number;
  }): Promise<ITicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  {
    versionKey: 'version',
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.findByEvent = async ({ id, version }) =>
  Ticket.findOne({ _id: id, version: version - 1 });
ticketSchema.statics.build = (ticket: ITicket) =>
  new Ticket({
    ...ticket,
    _id: ticket.id
  });
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this as any,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.completed
      ]
    }
  });

  return !!existingOrder;
};

export const Ticket = mongoose.model<ITicketDoc, ITicketModel>(
  'Ticket',
  ticketSchema
);
