import { Controller, Param } from '@nestjs/common';
import { PointService } from './point.service';
import { AuthGuard } from 'src/auth/guards/local-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Body, Post, Get } from '@nestjs/common';
import { CreatePointDto } from './point.d';

@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {}
  @UseGuards(AuthGuard)
  @Post('create/:cityId')
  async createPoint(@Body() data: CreatePointDto, @Param('cityId') cityId: string){
    return await this.pointService.createPoint(data, cityId)
  }
  @UseGuards(AuthGuard)
  @Get('list/:cityId')
  async getAllPoints(@Param('cityId') cityId: string){
    return await this.pointService.getAllPoints(cityId)
  }
  @UseGuards(AuthGuard)
  @Get(':pointId')
  async getPointById(@Param('pointId') pointId: string){
    return await this.pointService.getPointById(pointId)
  }
}
