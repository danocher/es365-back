import { Module } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { ShiftController } from './shift.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { SalaryService } from 'src/salary/salary.service';

@Module({
  controllers: [ShiftController],
  providers: [ShiftService, PrismaService, SalaryService],
  imports: [JwtModule.register( //UserModule,
     {secret: process.env.JWT_SECRET, signOptions: {expiresIn: '3h'}
    })]
})
export class ShiftModule {}
