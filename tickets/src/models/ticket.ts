import { HydratedDocument, Model, Schema, Types, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ITicket {
  title: string;
  price: number;
  userId: Types.ObjectId;
}
interface ITicketDoc extends Document {
  title: string;
  price: number;
  userId: Types.ObjectId;
  version: number;
}

interface ITicketModel extends Model<ITicketDoc> {
  build(ticket: ITicket): HydratedDocument<ITicketDoc>;
}

const ticketSchema = new Schema<ITicketDoc>(
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
    versionKey: 'version',
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.build = (ticket: ITicket) => new Ticket(ticket);

export const Ticket = model<ITicketDoc, ITicketModel>('Ticket', ticketSchema);
