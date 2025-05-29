import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PointController],
  providers: [PointService, PrismaService],
  imports: [JwtModule.register( //UserModule,
     {secret: process.env.JWT_SECRET, signOptions: {expiresIn: '3h'}
    })]
})
export class PointModule {}
