import { Module } from '@nestjs/common';
import { CateroryService } from './caterory.service';
import { CateroryController } from './caterory.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  controllers: [CateroryController],
  providers: [CateroryService, PrismaService, JwtService],
})
export class CateroryModule {}
