import { Controller, Post, Param, Get } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { AuthGuard } from 'src/auth/guards/local-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}
  @UseGuards(AuthGuard)
  @Post('point/:pointId')
  async getAllStatisticByPointId(@Param('pointId') pointId: string){
    return await this.statisticService.getAllStatisticByPointId(pointId)
  }
  @UseGuards(AuthGuard)
  @Post('manager/:pointId/:managerId')
  async getStatisticByManagerId(@Param('pointId') pointId: string, @Param('managerId') managerId: string){
    return await this.statisticService.getStatisticByPointIdAndManagerId(pointId, managerId)
  } 
  @UseGuards(AuthGuard)
  @Post('point/:pointId/:managerId/:dateStart/:dateEnd')
  async getStatisticByPointIdAndManagerIdAndDate(@Param('pointId') pointId: string, @Param('managerId') managerId: string, @Param('dateStart') dateStart: Date, @Param('dateEnd') dateEnd: Date){
    return await this.statisticService.getStatisticByPointIdAndManagerIdAndDate(pointId, managerId, dateStart, dateEnd)
  }
  @UseGuards(AuthGuard)
  @Post('point/:pointId/:dateStart/:dateEnd')
  async getStatisticByPointIdAndDate(@Param('pointId') pointId: string, @Param('dateStart') dateStart: Date, @Param('dateEnd') dateEnd: Date){
    return await this.statisticService.getStatisticByPointIdAndDate(pointId, dateStart, dateEnd)
  }
  @UseGuards(AuthGuard)
  @Post('profit/point/:pointId/:dateStart/:dateEnd')
  async getProfitByPointIdAndDate(@Param('pointId') pointId: string, @Param('dateStart') dateStart: Date, @Param('dateEnd') dateEnd: Date){
    return await this.statisticService.getSummProfitByPointIdAndDates(pointId, dateStart, dateEnd)
  }
  @UseGuards(AuthGuard)
  @Get('daily-finance/:pointId')
  async getDailyFinancials(@Param('pointId') pointId: string){
    return await this.statisticService.getTodayFinancials(pointId)
  }
  @UseGuards(AuthGuard)
  @Get('year/revenue/:pointId')
  async getYearRevenue(@Param('pointId') pointId: string){
    return await this.statisticService.getMonthlyRevenueByPoint(pointId)
  }
  @UseGuards(AuthGuard)
  @Get('year/profit/:pointId')
  async getYearProfit(@Param('pointId') pointId: string){
    return await this.statisticService.getMonthlyProfitByPoint(pointId)
  }
}
