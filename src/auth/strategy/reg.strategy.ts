
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RegStrategy {
  constructor(private prisma: PrismaService) {}

  async validate(email: string, password: string): Promise<any> {
    console.log(email)
        const user = await this.prisma.user.findUnique({
            where: { email },
          });
          if(user){
            return new InternalServerErrorException('Такой пользователь уже зарегистрирован')
          }
        }
}