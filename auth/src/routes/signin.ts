import { Router } from 'express';

const router = Router();

router.get('/api/users/signin', (req, res) => {
  res.send('signin!!');
});

export { router as signinRouter };
