import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { AuthGuard } from 'src/auth/guards/local-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CloseShiftDto, CreateShiftDto } from './shift';

@Controller('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}
  @UseGuards(AuthGuard)
  @Post('create/:managerId')
  async createShift(@Body() data: CreateShiftDto, @Param('managerId') managerId: string){
    return await this.shiftService.createShift(data, managerId)
  }
  @UseGuards(AuthGuard)
  @Get('list/:managerId')
  async getShiftsByManagerId(@Param('managerId') managerId: string){
    return await this.shiftService.getShiftsByManagerId(managerId)
  }
  @UseGuards(AuthGuard)
  @Get(':shiftId')
  async getShiftById(@Param('shiftId') shiftId: string){
    return await this.shiftService.getShiftById(shiftId)
  }
  @UseGuards(AuthGuard)
  @Post('close/:shiftId')
  async closeShift(@Param('shiftId') shiftId: string, @Body() data: CloseShiftDto){
    return await this.shiftService.closeShift(shiftId, data)
  }
}
