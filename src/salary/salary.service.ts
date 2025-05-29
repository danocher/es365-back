import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSalaryDto } from './salary';

@Injectable()
export class SalaryService {
    constructor(private readonly prisma: PrismaService){}
    async createSalary(data: CreateSalaryDto, managerId: string){
        let balance = 0
        const lastBalance = await this.prisma.salary.findFirst({
            where:{
                managerId: managerId,
            },
            select:{
                balance:true
            }
        })
        if(lastBalance.balance){
            balance = lastBalance.balance
        }
        balance += data.add_funds
        const salary = await this.prisma.salary.create({
            data: {
                ...data,
                balance: balance,
                managerId: managerId
            }
        })
        return salary
    }
    async calcSalary(data: CreateSalaryDto, managerId: string){
        let balance = 0
        const lastBalance = await this.prisma.salary.findFirst({
            where:{
                managerId: managerId,
            },
            select:{
                balance:true
            }
        })
        if(lastBalance.balance){
            balance = lastBalance.balance
        }
        if(data.withdrawals<=balance){
            balance -= data.withdrawals
        }
        else{
            throw new ConflictException('Недостаточно средств')
        }
        const salary = await this.prisma.salary.create({
            data: {
                ...data,
                balance: balance,
                managerId: managerId
            }
        })
        return salary
    }
}
