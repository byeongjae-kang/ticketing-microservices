import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest
} from '@bk0719/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Types } from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const EXPIRATION_WINDOW_SECONDS = 15 * 50;

const router = Router();

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .custom((input: string) => Types.ObjectId.isValid(input))
      .withMessage('Valid ticketId must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('The ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: new Types.ObjectId(req.currentUser!.id),
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    });

    await order.save();

    // await new orderCreatedPublisher(natsWrapper.client).publish({
    //   id: order.id,
    //   title: order.title,
    //   price: order.price
    // });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
