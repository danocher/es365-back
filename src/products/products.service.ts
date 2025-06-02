import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDto } from './products.d';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService){}
    async createProduct(data: CreateProductDto){
        const product = await this.prisma.product.create({
            data: {
                name: data.name,
                uniq_num: data.uniq_num,
                pointId: data.pointId
            }
        })
        return product
    }
    async getAllProducts(pointId: string){
        return await this.prisma.product.findMany({
            where:{
                pointId: pointId
            },
            select:{
                id:true,
                name:true,
            }
        })
    }
    async getProductById(productId: string){
        return await this.prisma.product.findUnique({
            where:{
                id: productId
            },
            include:{
                delivers:true,
                realizations:true
            }
        })
    }
}
