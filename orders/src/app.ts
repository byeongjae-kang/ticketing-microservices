import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { NotFoundError, currentUser, errorHandler } from '@bk0719/common';
import { showOrdersRouter } from './routes/orders';
import { showOrderRouter } from './routes/show';
import { createOrderRouter } from './routes/new';
import { deleteOrderRouter } from './routes/delete';

export const app = express();

app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);

app.use(currentUser);

app.use(createOrderRouter);
app.use(showOrdersRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

app.all('*', (req, res) => {
  console.log(req.body);
  throw new NotFoundError();
});
app.use(errorHandler);
