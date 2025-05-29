import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CloseShiftDto, CreateShiftDto } from './shift';
import { SalaryService } from 'src/salary/salary.service';

@Injectable()
export class ShiftService {
    constructor(private readonly prisma: PrismaService, private readonly salaryService: SalaryService){}
    async createShift(data: CreateShiftDto, managerId: string){
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
                point:true,
                realization:true
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
    async closeShift(shiftId: string, data: CloseShiftDto){
        const shift = await this.prisma.shift.findUnique({
            where:{
                id: shiftId
            },
            include:{
                manager:true,
                realization:{
                    include:{
                        products:true
                    }
                }
            }
        })
        const summ = shift.realization.reduce((acc, realization) => {
            return acc + realization.products.reduce((acc, product) => {
                return acc + product.sell
            }, 0)
        }, 0)
        const calcTime = shift.date_end.getTime() - shift.date_start.getTime()
        const hours = calcTime / (1000 * 60 * 60);
        const shiftHourSalary = shift.manager.shift_cost * hours
        const salaryData = {
            date: data.date_end,
            add_funds: shiftHourSalary+summ,
            withdrawals: null,
            managerId: shift.managerId
        }
        const salary =await this.salaryService.createSalary(salaryData, shift.managerId)
        return {
            shift,
            salary
        }
    }
}
