import { NotFoundError, requireAuth, validateRequest } from '@bk0719/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { ObjectId, Types } from 'mongoose';

const router = Router();

router.post(
  '/api/tickets/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);
    const ticket = await Ticket.findOne({ _id: id });
    console.log(ticket);
    if (!ticket) {
      throw new NotFoundError();
    }

    res.status(200).send(ticket);
  }
);

export { router as showTicketRouter };
