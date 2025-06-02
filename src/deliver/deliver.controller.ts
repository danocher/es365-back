import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DeliverService } from './deliver.service';
import { CreateDeliverDto } from './deliver.d';
import { AuthGuard } from 'src/auth/guards/local-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('deliver')
export class DeliverController {
  constructor(private readonly deliverService: DeliverService) {}
  @UseGuards(AuthGuard)
  @Post('create')
  createDeliver(@Body() data: CreateDeliverDto[]) {
    return this.deliverService.createDeliver(data);
  }

  @UseGuards(AuthGuard)
  @Get(':pointId')
  getDeliverByPoint(@Param('pointId') pointId: string) {
    return this.deliverService.getDeliverByPoint(pointId);
  }

  @UseGuards(AuthGuard)
  @Get(':productId')
  getDeliverByProductId(@Param('productId') productId: string) {
    return this.deliverService.getDeliverByProductId(productId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getDeliverById(@Param('id') id: string) {
    return this.deliverService.getDeliverById(id);
  }
}
