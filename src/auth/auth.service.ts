import {Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import {hash, compare} from 'bcrypt'
@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private readonly jwtService: JwtService,
        ){}
        private readonly SALT_ROUNDS = 12
    async emailRegister(data:UserEmailRegisterDto){
      const hashed = await hash(data.password, this.SALT_ROUNDS)
      const user = await this.prisma.user.create({
        data:{
          email:data.email,
          name: data.name,
          password: hashed,
        }
      })
      const owner = await this.prisma.owner.create({
        data:{
          userId: user.id
        }
      })
      return{
          user:user,
          token: this.jwtService.sign({id: user.id, email: user.email}, {expiresIn: '3h'}),
          refreshToken: this.jwtService.sign({id: user.id, email: user.email}, {expiresIn: '2d'})
      }
    }
    async login(data:UserEmailLoginDto){
      const user = await this.prisma.user.findUnique({where: {email:data.email}})
      const passwordCompare = await compare(data.password, user.password)
      if(!passwordCompare){
        throw new UnauthorizedException('Неверный логин или пароль')
      }
      return {
        user: user,
        token: this.jwtService.sign({id: user.id, email: user.email}, {expiresIn: '3h'}),
        refreshToken: this.jwtService.sign({id: user.id, email: user.email}, {expiresIn: '1d'})
      };
    }
}
