import { Controller, Param, Get } from '@nestjs/common';
import { CityService } from './city.service';
import { AuthGuard } from 'src/auth/guards/local-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { CreateCityDto } from './city.d';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}
  @UseGuards(AuthGuard)
  @Post('create/:categoryId')
  async createCity(@Body() data: CreateCityDto, @Param('categoryId') categoryId: string){
    return await this.cityService.createCity(data, categoryId)
  }
  @UseGuards(AuthGuard)
  @Get('list/:categoryId')
  async getAllCities(@Param('categoryId') categoryId: string){
    return await this.cityService.getAllCities(categoryId)
  }
}
