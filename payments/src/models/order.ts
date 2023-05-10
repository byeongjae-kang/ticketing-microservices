import { OrderStatus } from '@bk0719/common';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface IOrder {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  version: number;
  price: number;
  status: OrderStatus;
}

interface IOrderDoc extends mongoose.Document {
  userId: Types.ObjectId;
  version: number;
  price: number;
  status: OrderStatus;
}

interface IOrderModel extends mongoose.Model<IOrderDoc> {
  build(order: IOrder): HydratedDocument<IOrderDoc>;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    status: {
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
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (order: IOrder) =>
  new Order({
    _id: order.id,
    version: order.version,
    price: order.price,
    userId: order.userId,
    status: order.status
  });

export const Order = mongoose.model<IOrderDoc, IOrderModel>(
  'Order',
  orderSchema
);
