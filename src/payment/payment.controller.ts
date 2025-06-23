import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from 'src/auth/guards/local-auth.guard';
import { getServerCustomParams } from 'src/common/decorators/auth.decorator';
import { ServersParams } from 'src/types/types';
import { Cron } from '@nestjs/schedule';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @UseGuards(AuthGuard)
  @Post('pay')
  async Pay(@Body() body:CreatePaymentDto, @getServerCustomParams() params: ServersParams){
    return this.paymentService.createPay(body, params.ownerId)
  }
  @UseGuards(AuthGuard)
  @Post('check-pay/:id')
  async checking(@Param('id') id:string){
    return await this.paymentService.checkPay(id)
  }
  @UseGuards(AuthGuard)
  @Get('balance')
  async getBalance(@getServerCustomParams() params:ServersParams){
    return await this.paymentService.getBalanceOnPayment(params.ownerId)
  }
  @Cron('0 6 * * *', {timeZone: 'Asia/Yekaterinburg'})
  // @Post('debit')
  async debitFunds(){
    await this.paymentService.debit()
  }
}
