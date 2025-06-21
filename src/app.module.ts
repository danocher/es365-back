import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CateroryModule } from './caterory/caterory.module';
import { CityModule } from './city/city.module';
import { PointModule } from './point/point.module';
import { ManagerModule } from './manager/manager.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ClientModule } from './client/client.module';
import { TimetableModule } from './timetable/timetable.module';
import { ShiftModule } from './shift/shift.module';
import { RealizationModule } from './realization/realization.module';
import { SalaryModule } from './salary/salary.module';
import { DeliverModule } from './deliver/deliver.module';
import { ProductsModule } from './products/products.module';
import { StatisticModule } from './statistic/statistic.module';
import { PaymentModule } from './payment/payment.module';
import * as cookieParser from 'cookie-parser'
@Module({
  imports: [AuthModule, CateroryModule, CityModule, PointModule, ManagerModule, MailerModule.forRoot({
    transport: {
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    },
  }), ClientModule, TimetableModule, ShiftModule, RealizationModule, SalaryModule, DeliverModule, ProductsModule, StatisticModule, PaymentModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
