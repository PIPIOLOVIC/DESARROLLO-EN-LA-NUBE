import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
  PORT: env.get('PORT').default(3000).asPortNumber(),
  DB_HOST: env.get('DB_HOST').required().asString(),
  DB_PORT: env.get('DB_PORT').required().asPortNumber(),
  DB_USERNAME: env.get('DB_USERNAME').required().asString(),
  DB_PASSWORD: env.get('DB_PASSWORD').required().asString(),
  DB_NAME: env.get('DB_NAME').required().asString(),

  // Correo / Nodemailer
  MAIL_HOST: env.get('MAIL_HOST').required().asString(),
  MAIL_PORT: env.get('MAIL_PORT').required().asPortNumber(),
  MAIL_USER: env.get('MAIL_USER').required().asString(),
  MAIL_PASS: env.get('MAIL_PASS').required().asString(),
  MAIL_FROM: env.get('MAIL_FROM').required().asString(),
  MAINTENANCE_EMAIL: env.get('MAINTENANCE_EMAIL').required().asString(),
};