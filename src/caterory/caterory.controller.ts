import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CateroryService } from './caterory.service';
import { CreateCategoryDto } from './category.d';
import { Body, Post } from '@nestjs/common';
import { getServerCustomParams } from 'src/common/decorators/auth.decorator';
import { ServersParams } from 'src/types/types';
import { AuthGuard } from 'src/auth/guards/local-auth.guard';
@Controller('category')
export class CateroryController {
  constructor(private readonly cateroryService: CateroryService) {}
  @UseGuards(AuthGuard)
  @Post('create')
  async createCategory(@Body() data: CreateCategoryDto, @getServerCustomParams() params: ServersParams){
    return await this.cateroryService.createCategory(data, params.ownerId)
  }
  @UseGuards(AuthGuard)
  @Get()
  async getAllCategories(@getServerCustomParams() params: ServersParams){
    return await this.cateroryService.getCategoriesList(params.ownerId)
  }
  @UseGuards(AuthGuard)
  @Get(':categotyId')
  async getCategoryById(@Param('categotyId') categoryId: string){
    return await this.cateroryService.getCategoryById(categoryId)
  }
}
