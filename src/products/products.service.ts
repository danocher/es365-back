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
                pointId: data.pointId,
                amount:0
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
                amount:true,
                uniq_num:true,
                _count:{
                    select:{
                        delivers:true,
                        realizations:true
                    }
                }
            }
        })
    }
    async getProductById(productId: string){
        console.log(productId)
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
    async getOneProductByProductId(prodId:string){
        return await this.prisma.product.findUnique({
            where:{
                id: prodId
            },
            include:{
                delivers:{
                    orderBy: {
                        date: 'asc' // Сортировка по полю date от новых к старым
                    },
                },
                realizations:true
            }
        })
    }
    async getProductsForCreating(pointId:string){
        return await this.prisma.product.findMany({
            where:{
                pointId
            },
            include:{
                delivers:true
            }
        })
    }
}
