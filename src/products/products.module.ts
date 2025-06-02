import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  imports: [JwtModule.register( //UserModule,
     {secret: process.env.JWT_SECRET, signOptions: {expiresIn: '3h'}
    })]
})
export class ProductsModule {}
