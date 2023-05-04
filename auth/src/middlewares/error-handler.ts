import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    console.log('Something went wrong', err);
    res.status(400).send({
      message: err.message
    });
  }
};