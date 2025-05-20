import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserNotExistGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<true | false> {
    const request = context.switchToHttp().getRequest();
    const email = request.body.email; // или request.params.email в зависимости от вашего API

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
        return true; // Пользователь существует - запрещаем доступ
    }
    throw new NotFoundException('Пользователя с такой почтой не существует'); // Пользователя нет - разрешаем продолжение
  }
}