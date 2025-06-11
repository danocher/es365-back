import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { AuthGuard } from 'src/auth/guards/local-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateTimetableDto } from './timetable';

@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}
  @UseGuards(AuthGuard)
  @Post('create/:pointId')
  async createTimetable(@Body() data: CreateTimetableDto, @Param('pointId') pointId: string){
    return await this.timetableService.createTimetable(data, pointId)
  }
  @UseGuards(AuthGuard)
  @Get('list/:managerId')
  async getTimetableByPoint(@Param('managerId') managerId: string, @Query('dateStart') dateStart: Date | undefined, @Query('dateEnd') dateEnd: Date|undefined){
    return await this.timetableService.getTimetableByPoint(managerId, dateStart, dateEnd)
  }
  @UseGuards(AuthGuard)
  @Get('manager/:managerId')
  async getTimetableByManagerId(@Param('managerId') managerId: string){
    return await this.timetableService.getTimetableByManagerId(managerId)
  }
}
