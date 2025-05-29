import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AppService {
  constructor(private readonly mailService: MailerService) {}

  sendMail(to: string, from: string, subject: string, text: string) {
    this.mailService.sendMail({
      from: from,
      to: to,
      subject: subject,
      text: text,
    });
  }
  getHello(): string {
    return 'Hello World!';
  }
}
