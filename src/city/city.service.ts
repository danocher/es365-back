import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCityDto } from './city';

@Injectable()
export class CityService {
    constructor(private prisma: PrismaService){}
    async createCity(data: CreateCityDto, categoryId: string){
        const city = await this.prisma.city.create({
            data:{
                cityname: data.cityname,
                categoryId: categoryId
            }
        })
        return city
    }
    async getAllCities(categoryId: string){
        return await this.prisma.city.findMany({
            where:{
                categoryId: categoryId
            }
        })
    }
}
