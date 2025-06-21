import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
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
  async createPay(){
    const idempotenceKey = generateIdempotenceKey();
    const shopId = process.env.SHOP_ID
    const secretKey = process.env.PAYMENT_KEY
    const payload = {
    amount: {
      value: "100.00",
      currency: "RUB"
    },
    capture: true,
    confirmation: {
      type: "redirect",
      return_url: "https://www.example.com/return_url"
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
    console.log('Payment created:', data);
    return data;
  } catch (error) {
    console.error('Payment creation failed:', error);
    throw error;
  }
  }
}
