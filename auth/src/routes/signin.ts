import jwt from 'jsonwebtoken';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@bk0719/common';
import { User } from '../models/user';
import { Password } from '../services/password';

const router = Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password must be supplied')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError('Invalid credential');
    }

    const isValid = await Password.compare(user.password, password);
    if (!isValid) {
      throw new BadRequestError('Invalid credential');
    }

    const userJwt = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJwt };

    res.status(200).send(user);
  }
);

export { router as signinRouter };
