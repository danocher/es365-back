import { Controller } from '@nestjs/common';
import { DeliverService } from './deliver.service';

@Controller('deliver')
export class DeliverController {
  constructor(private readonly deliverService: DeliverService) {}
}
