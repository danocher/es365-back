import { Module } from '@nestjs/common';
import { RealizationService } from './realization.service';
import { RealizationController } from './realization.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [RealizationController],
  providers: [RealizationService, PrismaService],
  imports: [JwtModule.register( //UserModule,
     {secret: process.env.JWT_SECRET, signOptions: {expiresIn: '3h'}
    })]
})
export class RealizationModule {} 
