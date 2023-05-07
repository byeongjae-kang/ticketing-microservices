import { requireAuth, validateRequest } from '@bk0719/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { ObjectId, Types } from 'mongoose';

const router = Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').notEmpty().withMessage('Title must be provided'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: new Types.ObjectId(req.currentUser!.id)
    });

    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
