import mongoose, { Types } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';

let mongo: MongoMemoryServer;

jest.mock('../nats-wrapper');

beforeAll(async () => {
  process.env.JWT_KEY = 'secret key';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, { dbName: 'verifyMASTER' });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  collections.forEach((collection) => collection.deleteMany({}));
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.disconnect();
});

declare global {
  var signin: (id?: Types.ObjectId) => string[];
}

global.signin = (id = new Types.ObjectId()) => {
  const payload = {
    id,
    email: 'test@test.com'
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
};
