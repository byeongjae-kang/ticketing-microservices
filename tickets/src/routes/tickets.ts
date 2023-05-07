import { requireAuth } from '@bk0719/common';
import { Request, Response, Router } from 'express';
import { Ticket } from '../models/ticket';

const router = Router();

router.get('/api/tickets', requireAuth, async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  res.status(200).send(tickets);
});

export { router as showTicketsRouter };
