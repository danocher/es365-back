import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CateroryService {
    constructor(private prisma: PrismaService){}
    // async getCategoriesList(){
    //     const request = this.prisma.category.findMany({
    //         where:{
    //             ownerId:
    //         }
    //     })
    // }
}
