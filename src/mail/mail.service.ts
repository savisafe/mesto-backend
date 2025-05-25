import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async sendLoginLink(email: string, token: string) {
    try {
      const url = `${process.env.FRONTEND_URL}/login-with-email?token=${token}`;
      
      this.logger.debug(`Sending login link to ${email}`);
      this.logger.debug(`Mail configuration:`, {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        user: process.env.MAIL_USER,
        from: process.env.MAIL_FROM,
      });

      await this.mailerService.sendMail({
        to: email,
        subject: 'Ссылка для входа',
        template: 'login-link',
        context: {
          url,
          email,
        },
      });

      this.logger.debug(`Login link sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send login link to ${email}:`, error);
      throw error;
    }
  }
} 