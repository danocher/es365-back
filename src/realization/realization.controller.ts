import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RealizationService } from './realization.service';
import { AuthGuard } from 'src/auth/guards/local-auth.guard';
import { UseGuards } from '@nestjs/common';
import { getServerCustomParams } from 'src/common/decorators/auth.decorator';
import { ServersParams } from 'src/types/types';
import { CreateRealizationDto } from './realization.d';

@Controller('realization')
export class RealizationController {
  constructor(private readonly realizationService: RealizationService) {}
  @UseGuards(AuthGuard)
  @Post('create')
  createRealization(@Body() data: CreateRealizationDto, @getServerCustomParams() params: ServersParams){
    return this.realizationService.createRealization(data)
  }
  @UseGuards(AuthGuard)
  @Get('list/:pointId')
  getAllRealizations(@Param('pointId') pointId: string){
    return this.realizationService.getAllRealizations(pointId)
  }
  // @UseGuards(AuthGuard)
  // @Get(':realizationId')
  // async getRealizationById(@Param('realizationId') realizationId: string){
  //   return await this.realizationService.getRealizationById(realizationId)
  // }
  @Get(':realId')
  async getOrdeById(@Param('realId') realId: string){
    return await this.realizationService.getRealizationById(realId)
  }
  @Get('one/:realId')
  async getById(@Param('realId') realId: string){
    return await this.realizationService.getRealizationById(realId)
  }
}
