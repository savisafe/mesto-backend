import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendLoginLink(email: string, token: string) {
    const template = this.loadTemplate('login-link');
    const loginUrl = `${this.configService.get('FRONTEND_URL')}/auth/login/email/${token}`;
    const html = template({ loginUrl });

    await this.transporter.sendMail({
      from: this.configService.get('MAIL_FROM'),
      to: email,
      subject: 'Вход в систему',
      html,
    });
  }

  private loadTemplate(name: string): handlebars.TemplateDelegate {
    const templatePath = path.join(__dirname, 'templates', `${name}.hbs`);
    const template = fs.readFileSync(templatePath, 'utf-8');
    return handlebars.compile(template);
  }
}
