import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateManagerDto } from './manager';
import { generate } from 'generate-password';
import { hash } from 'bcrypt';
import { AppService } from 'src/app.service';

@Injectable()
export class ManagerService {
    constructor(private readonly prisma: PrismaService, private readonly appService: AppService){}
    async createManager(data: CreateManagerDto, ownerId: string, pointId){
        const password = generate({
            length: 12,
            numbers: true,
            symbols: true,
            uppercase: true,
            excludeSimilarCharacters: true,
        })
        const hashed = await hash(password, 12)
        const user = await this.prisma.user.create({
            data:{
                name: data.fullname,
                email: data.email,
                password: hashed,
            }
        })
        if(!user){
            throw new BadRequestException('Не удалось создать пользователя')
        }
        const manager = await this.prisma.manager.create({
            data:{
                shift_cost: data.shift_cost,
                personal_percent: data.personal_percent,
                ownerId: ownerId,
                pointId: pointId,
                userId: user.id
            }
        })
        if(!manager){
            throw new BadRequestException('Не удалось создать менеджера')
        }
        this.appService.sendMail(data.email, 'biznes.servis@internet.ru', 'ES365 Регистрация менеджера', `Ваш пароль: ${password}`)
        return {
            user: user,
            manager: manager
        }
    }
    async getAllManagers(pointId: string){
        const managers = await this.prisma.manager.findMany({
            where:{
                pointId: pointId
            },
            include:{
                user:{
                    select:{
                        name:true,
                        email:true,
                        id:true,
                    }
                },
            }
        })
        return managers
    }
    async getManagerById(managerId: string){
        const manager = await this.prisma.manager.findUnique({
            where:{
                id: managerId
            },
            include:{
                user:{
                    select:{
                        name:true,
                    }
                },
                point:true,
                owner:true,
                shifts:true,
                salary:true,
            }
        })
        return manager
    }
    async getManagersByPointId(pointId: string){
        const managers = await this.prisma.manager.findMany({
            where:{
                pointId: pointId
            },
            select:{
                id:true,
                user: {
                    select:{
                        name:true,
                    }
                }
            }
        })
        return managers
    }
}
