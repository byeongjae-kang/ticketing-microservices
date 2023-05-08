import {
  requireAuth,
  validateRequest,
  NotAuthorizedError,
  NotFoundError
} from '@bk0719/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').notEmpty().withMessage('Title must be provided'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId.toString() !== req.currentUser?.id.toString()) {
      throw new NotAuthorizedError();
    }

    ticket.set({ title: title, price: price });
    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as updateTicketRouter };