import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { PrismaService } from 'src/prisma.service';
import { AppService } from 'src/app.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ManagerController],
  providers: [ManagerService, PrismaService, AppService],
  imports: [JwtModule.register( //UserModule,
       {secret: process.env.JWT_SECRET, signOptions: {expiresIn: '3h'}
      })]
})
export class ManagerModule {}
