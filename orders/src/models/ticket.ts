import { OrderStatus } from '@bk0719/common';
import { Date, HydratedDocument, Model, Schema, model } from 'mongoose';
import { Order } from './order';

interface ITicket {
  title: string;
  price: number;
  version: number;
}
export interface ITicketDoc extends Document {
  title: string;
  price: number;
  version: number;
  createdAt?: Date;
  updatedAt?: Date;
  isReserved(): boolean;
}

interface ITicketModel extends Model<ITicketDoc> {
  build(ticket: ITicket): HydratedDocument<ITicketDoc>;
}

const ticketSchema = new Schema<ITicketDoc, ITicketModel>(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    version: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

ticketSchema.statics.build = (ticket: ITicket) => new Ticket(ticket);
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

export const Ticket = model<ITicketDoc, ITicketModel>('Ticket', ticketSchema);
