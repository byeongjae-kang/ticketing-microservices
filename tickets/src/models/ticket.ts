import { Date, HydratedDocument, Model, Schema, Types, model } from 'mongoose';

interface ITicket {
  title: string;
  price: number;
  userId: Types.ObjectId;
}
interface ITicketDoc extends Document {
  title: string;
  price: number;
  userId: Types.ObjectId;
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true
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
