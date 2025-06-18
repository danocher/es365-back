import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MonthlyProfit, MonthlyRevenue } from './statistic';

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
    async getTodaySummSell(){

    }
    async getTodaySummProfit(){

    }
    async getTodayFinancials(pointId:string) {
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)
        
        const todayEnd = new Date()
        todayEnd.setHours(23, 59, 59, 999)
      
        const items = await this.prisma.realizationItem.findMany({
          where: {
            realization: {
            pointId: pointId,
              date: {
                gte: todayStart,
                lte: todayEnd
              }
            }
          },
          select: {
            sell: true,
            buy: true,
            amount: true,
            realization: {
              select: {
                summ: true
              }
            }
          }
        })
      
        const revenue = items.reduce((sum, item) => sum + item.realization.summ, 0)
        const profit = items.reduce((sum, item) => sum + (item.sell - item.buy) * item.amount, 0)
      
        return { revenue, profit }
      }
      
      async getMonthlyRevenueByPoint(pointId: string): Promise<MonthlyRevenue[]> {
        // Получаем текущую дату и дату 12 месяцев назад
        const currentDate = new Date()
        const startDate = new Date()
        startDate.setMonth(currentDate.getMonth() - 11) // 11 месяцев назад + текущий = 12 месяцев
        startDate.setDate(1)
        startDate.setHours(0, 0, 0, 0)
      
        // Группируем по месяцам
        const monthlyData = await this.prisma.realization.groupBy({
          by: ['date'],
          where: {
            pointId: pointId,
            date: {
              gte: startDate,
              lte: currentDate
            }
          },
          _sum: {
            summ: true
          },
          orderBy: {
            date: 'asc'
          }
        })
      
        // Преобразуем данные в удобный формат
        const result: MonthlyRevenue[] = []
        const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
      
        // Создаем карту для всех 12 месяцев
        const monthsMap = new Map<string, MonthlyRevenue>()
        
        // Инициализируем все 12 месяцев
        for (let i = 0; i < 12; i++) {
          const date = new Date(startDate)
          date.setMonth(startDate.getMonth() + i)
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`
          
          monthsMap.set(monthKey, {
            month: monthNames[date.getMonth()],
            year: date.getFullYear(),
            revenue: 0
          })
        }
      
        // Заполняем данные из запроса
        monthlyData.forEach(item => {
          const date = new Date(item.date)
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`
          
          if (monthsMap.has(monthKey)) {
            monthsMap.get(monthKey)!.revenue = item._sum.summ || 0
          }
        })
      
        // Преобразуем Map в массив
        return Array.from(monthsMap.values())
      }
      async  getMonthlyProfitByPoint(pointId: string): Promise<MonthlyProfit[]> {
        // Получаем текущую дату и дату 12 месяцев назад
        const currentDate = new Date()
        const startDate = new Date()
        startDate.setMonth(currentDate.getMonth() - 11) // 11 месяцев назад + текущий = 12 месяцев
        startDate.setDate(1)
        startDate.setHours(0, 0, 0, 0)
      
        // Получаем все товары, проданные за период
        const items = await this.prisma.realizationItem.findMany({
          where: {
            realization: {
              pointId: pointId,
              date: {
                gte: startDate,
                lte: currentDate
              }
            }
          },
          select: {
            sell: true,
            buy: true,
            amount: true,
            realization: {
              select: {
                date: true
              }
            }
          }
        })
      
        // Группируем прибыль по месяцам
        const monthlyProfitMap = new Map<string, number>()
        const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
      
        // Инициализируем все 12 месяцев с нулевой прибылью
        for (let i = 0; i < 12; i++) {
          const date = new Date(startDate)
          date.setMonth(startDate.getMonth() + i)
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`
          monthlyProfitMap.set(monthKey, 0)
        }
      
        // Рассчитываем прибыль для каждого товара и распределяем по месяцам
        items.forEach(item => {
          const date = new Date(item.realization.date)
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`
          const itemProfit = (item.sell - item.buy) * item.amount
          
          if (monthlyProfitMap.has(monthKey)) {
            monthlyProfitMap.set(monthKey, monthlyProfitMap.get(monthKey)! + itemProfit)
          }
        })
      
        // Преобразуем Map в массив объектов
        const result: MonthlyProfit[] = []
        monthlyProfitMap.forEach((profit, monthKey) => {
          const [year, monthIndex] = monthKey.split('-').map(Number)
          result.push({
            month: monthNames[monthIndex],
            year: year,
            profit: profit
          })
        })
      
        // Сортируем по году и месяцу
        return result.sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year
          return monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
        })
      }
}
