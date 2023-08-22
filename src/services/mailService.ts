import nodemailer from 'nodemailer';
import { MailInterface } from '../interfaces/mailInterface';
import { config } from 'dotenv';

config();

export default class MailService {
  private static instance: MailService;
  private transporter!: nodemailer.Transporter;

  private constructor() {}

  static getInstance() {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }
    return MailService.instance;
  }

  async createConnection() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'redditprojectexample@gmail.com', // `${process.env.SMTP_USERNAME}`,
        pass: 'Examplepassword', //`${process.env.SMTP_PASSWORD}`,
      },
    });
  }

  async sendMail(options: MailInterface) {
    return await this.transporter.sendMail({
      from: `"Reddit project" <${process.env.SMTP_USERNAME}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }

  async verifyConnection() {
    return this.transporter.verify();
  }

  getTransporter() {
    return this.transporter;
  }
}
