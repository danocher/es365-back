import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClientService } from './client.service';
import { AuthGuard } from 'src/auth/guards/local-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateClientDto } from './client';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @UseGuards(AuthGuard)
  @Post('create/:pointId')
  async createClient(@Body() data: CreateClientDto, @Param('pointId') pointId: string){
    return await this.clientService.createClient(data, pointId)
  }
  @UseGuards(AuthGuard)
  @Get('list/:pointId')
  async getAllClients(@Param('pointId') pointId: string){
    return await this.clientService.getAllClients(pointId)
  }
  @UseGuards(AuthGuard)
  @Get(':clientId')
  async getClientById(@Param('clientId') clientId: string){
    return await this.clientService.getClientById(clientId)
  }
}
