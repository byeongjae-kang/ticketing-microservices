import { ValidationError } from 'express-validator';

class DatabaseConnectionError extends Error {
  constructor(private errors: ValidationError[]) {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
