import { Date, HydratedDocument, Model, Schema, model } from 'mongoose';

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

export const Ticket = model<ITicketDoc, ITicketModel>('Ticket', ticketSchema);
