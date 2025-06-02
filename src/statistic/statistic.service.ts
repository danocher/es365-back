import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StatisticService {
    constructor(private readonly prisma: PrismaService){}
    async getAllStatisticByPointId(pointId: string){
    const realizations = await this.prisma.realization.findMany({
        where:{
            pointId: pointId
        },
        select:{
            id:true,
            summ:true,
        }
    })
    const summ = realizations.reduce((acc, realization) => acc + realization.summ, 0)
    return {SellSummForAllTime: summ}
    }
    async getStatisticByPointIdAndDate(pointId: string, dateStart: Date, dateEnd: Date){
        const realizations = await this.prisma.realization.findMany({
            where:{
                pointId: pointId,
                date: {
                    gte: dateStart,
                    lte: dateEnd
                }
            },
            select:{
                id:true,
                summ:true,
            }
        })
        const summ = realizations.reduce((acc, realization) => acc + realization.summ, 0)
        return {SellSummForPeriod: summ,
            Period:{
                start: dateStart,
                end: dateEnd
            }
        }
    }
    async getStatisticByPointIdAndManagerId(pointId: string, managerId: string){
        const realizations = await this.prisma.realization.findMany({
            where:{
                pointId: pointId,
                shift:{
                    managerId: managerId
                }
            },
            select:{
                id:true,
                summ:true,
            }
        })
        const summ = realizations.reduce((acc, realization) => acc + realization.summ, 0)
        return {SellSummForAllTime: summ,
            managerId: managerId
        }
    }
    async getStatisticByPointIdAndManagerIdAndDate(pointId: string, managerId: string, dateStart: Date, dateEnd: Date){
        const realizations = await this.prisma.realization.findMany({
            where:{
                pointId: pointId,
                shift:{
                    managerId: managerId
                },
                date: {
                    gte: dateStart,
                    lte: dateEnd
                }
            },
            select:{
                id:true,
                summ:true,
            }
        })
        const summ = realizations.reduce((acc, realization) => acc + realization.summ, 0)
        return {SellSummForPeriod: summ,
            managerId: managerId,
            Period:{
                start: dateStart,
                end: dateEnd
            }
        }
    }
    async getSummProfitByPointIdAndDates(pointId: string, dateStart: Date, dateEnd: Date){
        const realizations = await this.prisma.realization.findMany({
            where:{
                pointId: pointId,
                date: {
                    gte: dateStart,
                    lte: dateEnd
                }
            },
            select:{
                id:true,
                summ:true,
                items:{
                    select:{
                        buy:true,
                        sell:true
                    }
                }
            }
        })
        const sumDifference = realizations.reduce((total, realization) => {
            return total + realization.items.reduce((realizationTotal, item) => {
              return realizationTotal + (item.sell - item.buy);
            }, 0);
          }, 0);
          return {Profit: sumDifference,
            Period:{
                start: dateStart,
                end: dateEnd
            }
        }
    }
}
