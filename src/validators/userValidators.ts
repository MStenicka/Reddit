import { body, ValidationChain, validationResult } from 'express-validator';
import User from '../models/userModel';

const validateUsername: ValidationChain = body('username')
  .notEmpty()
  .withMessage('Username is required')
  .isLength({ min: 3 })
  .withMessage('Username must be at least 3 characters long')
  .isLength({ max: 20 })
  .withMessage('Username must be at most 20 characters long')
  .matches(/^[a-zA-Z0-9]+$/)
  .withMessage('Username must contain only letters and numbers')
  .custom(async (username) => {
    const existingUser = await User.findUserByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }
    return Promise.resolve();
  });

const validateEmail: ValidationChain = body('email')
  .isEmail()
  .withMessage('Valid email is required')
  .isLength({ max: 50 })
  .withMessage('Email must be at most 50 characters long')
  .custom(async (email) => {
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return Promise.reject('Email already exists');
    }
    return Promise.resolve();
  });

const validatePassword: ValidationChain = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter');

export const validateRegistration: ValidationChain[] = [
  validateUsername,
  validateEmail,
  validatePassword,
];

export const validateLogin: ValidationChain[] = [
  validateUsername,
  validatePassword,
];

export function validationRes(req: any, res: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
}
