import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException, MethodNotAllowedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OwnerRoleGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<true | false> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const token = authHeader.split(' ')[1] // или request.params.email в зависимости от вашего API
    const userFromJwt = this.jwtService.verify(token, {secret: process.env.JWT_SECRET})
    const {id} = userFromJwt
    const owner = await this.prisma.user.findUnique({
      where:{id},
      select:{
        director:true
      }
    })
    if(!owner){
      throw new MethodNotAllowedException('Недостаточно прав')
    }
    return true
  }
}