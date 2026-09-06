import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs } from '../config/envs';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: envs.MAIL_HOST,
      port: envs.MAIL_PORT,
      secure: envs.MAIL_PORT === 465,
      auth: {
        user: envs.MAIL_USER,
        pass: envs.MAIL_PASS,
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });
  }

  async sendEmail(to: string, subject: string, template: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: envs.MAIL_FROM,
        to,
        subject,
        html: template,
      });
      this.logger.log(`Correo de notificación enviado exitosamente a: ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Error al enviar correo de notificación a ${to}:`, error);
      return false;
    }
  }
}