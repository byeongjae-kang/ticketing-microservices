import { Router } from 'express';

const router = Router();

router.get('/api/users/signout', (req, res) => {
  res.send('signout!!');
});

export { router as signoutRouter };
