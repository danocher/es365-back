import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { AuthGuard } from 'src/auth/guards/local-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateSalaryDto } from './salary';

@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}
  @UseGuards(AuthGuard)
  @Post('calc/:managerId')
  async calcSalary(@Body() data: CreateSalaryDto, @Param('managerId') managerId: string){
    return await this.salaryService.calcSalary(data, managerId)
  }
  @UseGuards(AuthGuard)
  @Get('balance/:managerId')
  async getSalaryBalance(@Param('managerId') managerId: string){
    return await this.salaryService.getSalaryBalance(managerId)
  }
  @UseGuards(AuthGuard)
  @Get('history/:managerId')
  async getSalaryHistory(@Param('managerId') managerId: string){
    return await this.salaryService.getSalaryHistory(managerId)
  }
}
