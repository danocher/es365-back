import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService],
  imports: [JwtModule.register( //UserModule,
       {secret: process.env.JWT_SECRET, signOptions: {expiresIn: '3h'}
      })]
})
export class PaymentModule {}
