import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserExistGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<true | false> {
    const request = context.switchToHttp().getRequest();
    const email = request.body.email; // или request.params.email в зависимости от вашего API

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      throw new InternalServerErrorException('Пользователь с такой почтой уже существует'); // Пользователь существует - запрещаем доступ
    }
    return true; // Пользователя нет - разрешаем продолжение
  }
}