import mongoose, { HydratedDocument, Types } from 'mongoose';

interface IPayment {
  orderId: Types.ObjectId;
  stripeId: string;
}

interface IPaymentDoc extends mongoose.Document {
  orderId: Types.ObjectId;
  stripeId: string;
}

interface IPaymentModel extends mongoose.Model<IPaymentDoc> {
  build(order: IPayment): HydratedDocument<IPaymentDoc>;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    stripeId: {
      type: String,
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

paymentSchema.statics.build = (payment: IPayment) => new Payment(payment);

export const Payment = mongoose.model<IPaymentDoc, IPaymentModel>(
  'Payment',
  paymentSchema
);
