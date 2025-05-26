import { Module } from '@nestjs/common';
import { CateroryService } from './caterory.service';
import { CateroryController } from './caterory.controller';

@Module({
  controllers: [CateroryController],
  providers: [CateroryService],
})
export class CateroryModule {}
