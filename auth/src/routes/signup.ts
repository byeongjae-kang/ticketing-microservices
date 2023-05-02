import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = Router();

router.get(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send(errors.array());
    }

    console.log('creating user...');
    res.send({});
  }
);

export { router as signupRouter };
