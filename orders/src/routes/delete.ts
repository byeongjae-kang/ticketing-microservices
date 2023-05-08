import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth
} from '@bk0719/common';
import { Request, Response, Router } from 'express';
import { Order } from '../models/order';

const router = Router();

router.patch(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId.toString() !== req.currentUser?.id.toString()) {
      throw new NotAuthorizedError();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    // await new orderUpdatedPublisher(natsWrapper.client).publish({});

    res.status(201).send(order);
  }
);

export { router as deleteOrderRouter };
