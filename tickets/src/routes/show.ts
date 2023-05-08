import { NotFoundError } from '@bk0719/common';
import { Request, Response, Router } from 'express';
import { Ticket } from '../models/ticket';

const router = Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const ticket = await Ticket.findOne({ _id: id });

  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).send(ticket);
});

export { router as showTicketRouter };
