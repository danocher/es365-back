import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from 'src/prisma.service';
function generateIdempotenceKey() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
//https://api.yookassa.ru/v3/payments/{payment_id} Для проверки платежа -u <Идентификатор магазина>:<Секретный ключ> 'Authorization': 'Basic ' + btoa(shopId + ':' + secretKey),
@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService){}
  async createPay(payData:CreatePaymentDto, ownerId:string){
    const idempotenceKey = generateIdempotenceKey();
    const shopId = process.env.SHOP_ID
    const secretKey = process.env.PAYMENT_KEY
    
  const checkbalance = await this.prisma.payment.findFirst({
      where:{
        ownerId:ownerId
      },
      orderBy: {date: 'desc'},
      select:{
        balance:true
      }
    })
    const balance = (checkbalance && checkbalance.balance && checkbalance.balance!=null ) ? checkbalance.balance:0
    const payment = await this.prisma.payment.create({
      data:{
        balance:balance,
        ownerId: ownerId,
        status: 'CREATED',
      },
      
    })
    const payload = {
    amount: {
      value: payData.value,
      currency: "RUB"
    },
    capture: true,
    confirmation: {
      type: "redirect",
      return_url: `http://localhost:3000/company/payment/${payment.id}`
    },
    description: "Заказ №1"
  };
    try {
    const response = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(shopId + ':' + secretKey),
        'Idempotence-Key': idempotenceKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const order = await this.prisma.paymentOrder.create({
      data:{
            idempotence: idempotenceKey,
            yoo_order_id: data.id,
            summ: payData.value.toString(),
            payment_id:payment.id
      }
    })
    
    console.log('Payment created:', data);
    return {kassa: data, payment: payment, order: order};
  } catch (error) {
    console.error('Payment creation failed:', error);
    throw error;
  }
  }
  async checkPay(payId:string){
    const payment = await this.prisma.payment.findUnique({
      where:{
        id:payId
      },
      include:{
        order:true
      }
    })
    const shopId = process.env.SHOP_ID
    const secretKey = process.env.PAYMENT_KEY
    await fetch(`https://api.yookassa.ru/v3/payments/${payment.order.yoo_order_id}`,{
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + btoa(shopId + ':' + secretKey),
        'Content-Type': 'application/json'
      },
    })
    .then((res)=>{
      return res.json()
    })
    .then(async(res)=>{
      
      if(res.status == 'succeeded' && payment.status != 'FINISHED'){
        await this.prisma.payment.update({
          where:{
            id: payment.id
          },
          data:{
            add_funds: Number(res.income_amount.value),
            balance:{
              increment: Number(res.income_amount.value)
          
            },
            status: 'FINISHED'
          }
        })
      }
    })
    


  }
  async getBalanceOnPayment(ownerId:string){
    const checkbalance = await this.prisma.payment.findFirst({
      where:{
        ownerId:ownerId
      },
      orderBy: {date: 'desc'},
      select:{
        balance:true
      }
    })
    const balance = (checkbalance && checkbalance.balance && checkbalance.balance!=null ) ? checkbalance.balance:0
    return {balance: balance}
  }
  async debit(){
    const owners = await this.prisma.owner.findMany({
      include:{
        payment:{
          orderBy:{
            date:'desc'
          }
        }
      }
    })
    await this.prisma.$transaction(async (prisma)=>{
      await Promise.all(
        owners.map(async (owner)=>{
          const balance = owner.payment[0].balance
          console.log(balance)
          if(balance>=15){
            await prisma.payment.create({
              data:{
                withdrawals: 15,
                balance: balance-15,
                status: 'FINISHED',
                ownerId:owner.id
            }
          })
          }
          else{
            await prisma.payment.create({
              data:{
                withdrawals: 15,
                balance: balance,
                status: 'CANCELLED',
                ownerId:owner.id
            }
          })}

        })
      )
    })
    console.log('cron activated')
  }
}
