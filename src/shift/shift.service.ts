import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CloseShiftDto, CreateShiftDto } from './shift';
import { SalaryService } from 'src/salary/salary.service';
function calculateDuration(
  date: Date,
  timeStart: string, // формат "HH:MM"
  timeEnd: string    // формат "HH:MM"
): number {
  // Разбираем время начала
  console.log(date)
  const [startHours, startMinutes] = timeStart.split(':').map(Number);
  
  // Разбираем время окончания
  const [endHours, endMinutes] = timeEnd.split(':').map(Number);
  
  // Создаём объекты Date для начала и окончания
  const startDateTime = new Date(date);
  startDateTime.setHours(startHours, startMinutes, 0, 0);
  
  const endDateTime = new Date(date);
  endDateTime.setHours(endHours, endMinutes, 0, 0);
  
  // Если время окончания меньше времени начала - добавляем 1 день
  if (endDateTime.getTime() < startDateTime.getTime()) {
    endDateTime.setDate(endDateTime.getDate() + 1);
  }
  
  // Явно преобразуем в числовые timestamp перед вычитанием
  const diffMs = endDateTime.getTime() - startDateTime.getTime();
  
  // Переводим в часы с десятичной дробью
  const diffHours = diffMs / (1000 * 60 * 60);
  
  // Округляем до 1 знака после запятой
  return Math.round(diffHours * 10) / 10;
}
@Injectable()
export class ShiftService {
    constructor(private readonly prisma: PrismaService, private readonly salaryService: SalaryService){}
    async createShift(data: CreateShiftDto, managerId: string){
        const shiftYet = await this.prisma.shift.findMany({
            where:{
                managerId,
                date:data.date
            }
        })
        if(shiftYet.length!=0){
            throw new ConflictException('Смена у данного пользователя сегодня уже открыта')
        }
        const shift = await this.prisma.shift.create({
            data: {
                ...data,
                managerId: managerId
            }
        })
        return shift
    }
    async getShiftsByManagerId(managerId: string){
        const shifts = await this.prisma.shift.findMany({
            where:{
                managerId: managerId
            },
            include:{
                manager:{
                    select:{
                        id:true,
                        user:{
                            select:{
                                name:true,
                            }
                        }
                    }
                },
            }
        })
        return shifts
    }
    async getShiftById(shiftId: string){
        const shift = await this.prisma.shift.findUnique({
            where:{
                id: shiftId
            },
            include:{
                manager:{
                    select:{
                        id:true,
                        user:{
                            select:{
                                name:true,
                            }
                        }
                    }
                },
                point:true,
                realization:true
            }
        })
        return shift
    }
    async getShiftNotClosed(managerId:string, date: Date){
        const shifts = await this.prisma.shift.findMany({
            where:{
                managerId: managerId,
                time_end: null,
                date: date
            },
            select:{
                id:true
            }
        })
        return shifts
    }
    async closeShift(shiftId: string, data: CloseShiftDto){
        console.log(data.time_end)
        const shift = await this.prisma.shift.findUnique({
            where:{
                id: shiftId
            },
            include:{
                manager:true,
                realization:{
                    include:{
                        items:true
                    }
                }
            }
        })
        const summ = shift.realization.reduce((acc, realization) => {
            return acc + realization.items.reduce((acc, item) => {
                return acc + item.summ
            }, 0)
        }, 0)
        const calcTime = calculateDuration(shift.date, shift.time_start, data.time_end)
        console.log('время работы', calcTime)
        const shiftHourSalary = shift.manager.shift_cost * calcTime
        const salaryData = {
            date: shift.date,
            add_funds: shiftHourSalary + (summ* (shift.manager.personal_percent/100)),
            withdrawals: null,
            managerId: shift.managerId
        }
        const salary =await this.salaryService.createSalary(salaryData, shift.managerId)
        await this.prisma.shift.update({
            where:{
                id:shift.id
            },
            data:{
                time_end:data.time_end
            }
        })
        return {
            shift,
            salary
        }
    }

}
