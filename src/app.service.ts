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
  sendHtml(to: string, from: string, subject: string, password: string){
    const logoUrl = 'https://psv4.userapi.com/s/v1/d/GPtvt3LfffOzZO9dX2oJ3tyIdBgz6D4HblJy22kBuj2EPb7_pDejMSlNfpQ0W9XCPQBNlbzknEI-oCGqzrU703uQqOKAxjGZInmGjICg1a0Nrnsr8AB5Bg/logo.png'
    this.mailService.sendMail({
      to: to,
      from:from,
      subject: subject,
      template: 'password-template', // Имя шаблона (если используете)
      context: { // Данные для подстановки в шаблон
        password,
        logoUrl
      },
    })
  }
  getHello(): string {
    return 'Hello World!';
  }
}
