import { Controller } from '@nestjs/common';
import { CateroryService } from './caterory.service';

@Controller('caterory')
export class CateroryController {
  constructor(private readonly cateroryService: CateroryService) {}
}
