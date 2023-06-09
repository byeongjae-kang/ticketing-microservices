import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { NotFoundError, currentUser, errorHandler } from '@bk0719/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { showTicketsRouter } from './routes/tickets';
import { updateTicketRouter } from './routes/update';

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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(showTicketsRouter);
app.use(updateTicketRouter);

app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);
