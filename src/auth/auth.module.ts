import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
@Module({
  controllers: [AuthController],
  providers: [AuthService,  PrismaService], //LocalStrategy,
  imports:[ PassportModule, JwtModule.register( //UserModule,
   {secret: process.env.JWT_SECRET, signOptions: {expiresIn: '3h'}
  })]
})
export class AuthModule {}
