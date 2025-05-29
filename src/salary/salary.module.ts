import { Module } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { SalaryController } from './salary.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SalaryController],
  providers: [SalaryService, PrismaService],
})
export class SalaryModule {}
