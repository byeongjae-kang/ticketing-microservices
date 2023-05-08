import { NotAuthorizedError, NotFoundError, requireAuth } from '@bk0719/common';
import { Request, Response, Router } from 'express';
import { Order } from '../models/order';

const router = Router();

router.get(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id }).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId.toString() !== req.currentUser!.id.toString()) {
      throw new NotAuthorizedError();
    }

    res.status(200).send(order);
  }
);

export { router as showOrderRouter };
