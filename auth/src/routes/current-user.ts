import { currentUser } from '@bk0719/common';
import { Router } from 'express';

const router = Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
