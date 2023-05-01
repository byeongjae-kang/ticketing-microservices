import { Router } from 'express';

const router = Router();

router.get('/api/users/signup', (req, res) => {
  res.send('signup!!');
});

export { router as signupRouter };
