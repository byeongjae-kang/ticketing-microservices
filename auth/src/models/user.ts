import { Date, HydratedDocument, Model, Schema, Types, model } from 'mongoose';

interface IUser {
  email: string;
  password: string;
}
interface IUserDoc extends Document {
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IUserModel extends Model<IUserDoc> {
  build(user: IUser): HydratedDocument<IUserDoc>;
}

const userSchema = new Schema<IUserDoc, IUserModel>(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

userSchema.statics.build = (user: IUser) => new User(user);

export const User = model<IUserDoc, IUserModel>('User', userSchema);
