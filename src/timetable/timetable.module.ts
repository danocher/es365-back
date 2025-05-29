import { Module } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [TimetableController],
  providers: [TimetableService, PrismaService],
  imports: [JwtModule.register( //UserModule,
     {secret: process.env.JWT_SECRET, signOptions: {expiresIn: '3h'}
    })]
})
export class TimetableModule {}
