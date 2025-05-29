import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExtendedReq } from 'src/common/utils';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<true | false> {
    const request: ExtendedReq = context.switchToHttp().getRequest();
    const authToken = request.headers.authorization
    if(!authToken){
      throw new UnauthorizedException('Пользователь не авторизован')
    }
    const token = authToken.split(' ')[1]
    let userFromJwt
    try{
      userFromJwt = this.jwtService.verify(token, {secret: process.env.JWT_SECRET})
    }
    catch(e){
      throw new UnauthorizedException('Пользователь не авторизован')
    }
    if(!userFromJwt){
      throw new UnauthorizedException('Пользователь не авторизован')
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userFromJwt.id },
      select:{
        id:true,
        director:true,
        manager:true,
      }
    });
    if(user.director){
      request.userId = user.id
      request.ownerId = user.director.id
      return true
    }
    if(user.manager){
      request.userId = user.id  
      request.ownerId = user.manager.ownerId
      return true
    }
    if (!user) {
      throw new UnauthorizedException('Пользователь не существует'); 
    }
    return true; 
  }
}