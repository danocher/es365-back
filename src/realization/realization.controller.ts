import { Controller } from '@nestjs/common';
import { RealizationService } from './realization.service';

@Controller('realization')
export class RealizationController {
  constructor(private readonly realizationService: RealizationService) {}
}
