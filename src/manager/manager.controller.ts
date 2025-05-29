import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { AuthGuard } from 'src/auth/guards/local-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateManagerDto } from './manager';
import { getServerCustomParams } from 'src/common/decorators/auth.decorator';
import { ServersParams } from 'src/types/types';

@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}
  @UseGuards(AuthGuard)
  @Post('create/:pointId')
  async createManager(@Body() data: CreateManagerDto, @getServerCustomParams() params: ServersParams, @Param('pointId') pointId: string){
    return await this.managerService.createManager(data, params.ownerId, pointId)
  }
  @UseGuards(AuthGuard)
  @Get('list/:pointId')
  async getAllManagers(@Param('pointId') pointId: string){
    return await this.managerService.getAllManagers(pointId)
  } 
  @UseGuards(AuthGuard)
  @Get(':managerId')
  async getManagerById(@Param('managerId') managerId: string){
    return await this.managerService.getManagerById(managerId)
  }
  @UseGuards(AuthGuard)
  @Get('point/:pointId')
  async getManagersByPointId(@Param('pointId') pointId: string){
    return await this.managerService.getManagersByPointId(pointId)
  }
}
