import mongoose, {
  HydratedDocument,
  Model,
  Schema,
  Types,
  model
} from 'mongoose';
import { OrderStatus } from '@bk0719/common';
import { ITicketDoc } from './ticket';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

const statuses = [
  OrderStatus.Created,
  OrderStatus.Cancelled,
  OrderStatus.AwaitingPayment,
  OrderStatus.completed
] as const;

type StatusType = (typeof statuses)[number];

interface IOrder {
  ticket: ITicketDoc;
  userId: Types.ObjectId;
  status: StatusType;
  expiresAt: Date;
}
interface IOrderDoc extends mongoose.Document {
  ticket: ITicketDoc;
  userId: Types.ObjectId;
  status: StatusType;
  expiresAt: Date;
  version: number;
}

interface IOrderModel extends Model<IOrderDoc> {
  build(order: IOrder): HydratedDocument<IOrderDoc>;
}

const orderSchema = new Schema(
  {
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      require: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true
    },
    status: {
      type: String,
      enum: statuses,
      required: true,
      default: OrderStatus.Created
    },
    expiresAt: {
      type: Schema.Types.Date
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

orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.statics.build = (order: IOrder) => new Order(order);

export const Order = model<IOrderDoc, IOrderModel>('Order', orderSchema);
