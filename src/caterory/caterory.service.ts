import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './category';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CateroryService {
    constructor(private prisma: PrismaService){}
    async createCategory(data: CreateCategoryDto, ownerId: string){
        const category = await this.prisma.category.create({
            data:{
                name: data.name,
                ownerId: ownerId
            }
        })
        return category
    }
    async getCategoriesList(ownerId: string){
        return await this.prisma.category.findMany({
            where:{
                ownerId: ownerId
            }
        })
    }
    async getCategoryById(categoryId: string){
        const category = await this.prisma.category.findUnique({
            where:{
                id: categoryId
            }
        })
        if(!category){
            throw new NotFoundException('Категория не найдена')
        }
        return category
    }
}
