import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = 'secret key';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, { dbName: 'verifyMASTER' });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  collections.forEach((collection) => collection.deleteMany({}));
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.disconnect();
});
