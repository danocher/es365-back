import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateClientDto } from './client';

@Injectable()
export class ClientService {
    constructor(private readonly prisma: PrismaService){}
    async createClient(data: CreateClientDto, pointId: string){
        const client = await this.prisma.client.create({
            data: {
                name: data.name,
                phonenum: data.phonenum,
                birth: data.birth,
                pointId: pointId,
            }
        })
        return client
    }
    async getAllClients(pointId: string){
        const clients = await this.prisma.client.findMany({
            where:{
                pointId: pointId
            },
            select: {
                id: true,
                name: true,
                birth:true,
                pointId:true,
                phonenum:true,
                _count: {
                select: {
                    realizations: true
                }
                }
            }
        })
        return clients
    }
    async getClientById(clientId: string){
        const client = await this.prisma.client.findUnique({
            where:{
                id: clientId
            },
            include:{
                realizations:true,
            }
        })
        return client
    }
}
