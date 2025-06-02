import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from 'src/auth/guards/local-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateProductDto } from './products.d';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  createProduct(@Body() data: CreateProductDto) {
    return this.productsService.createProduct(data);
  }

  @UseGuards(AuthGuard)
  @Get(':pointId')
  getProductsByPoint(@Param('pointId') pointId: string) {
    return this.productsService.getAllProducts(pointId);
  }

  @UseGuards(AuthGuard)
  @Get(':productId')
  getProductById(@Param('productId') productId: string) {
    return this.productsService.getProductById(productId);
  }
}
