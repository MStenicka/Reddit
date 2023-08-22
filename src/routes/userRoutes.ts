import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import MailService from '../services/mailService';
import { MailInterface } from '../interfaces/mailInterface';
import { validationResult } from 'express-validator';
import {
  validateRegistration,
  validateLogin,
} from '../validators/userValidators';

const router = express.Router();

router.post(
  '/register',
  validateRegistration,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      const mailService = MailService.getInstance();
      //await mailService.createConnection();

      // const emailOptions: MailInterface = {
      //   to: email,
      //   subject: 'Potvrzení registrace na Reddit Project',
      //   text: 'Děkujeme za registraci!',
      //   html: '<p>Děkujeme za registraci!</p>',
      // };

      //const mailResponse = await mailService.sendMail(emailOptions);

      //console.log('Email sent:', mailResponse);

      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },
);

router.post('/login', validateLogin, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  try {
    const { username, password } = req.body;
    const user = await User.findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'User not exists' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, 'secret-key', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
