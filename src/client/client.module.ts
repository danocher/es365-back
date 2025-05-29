import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ClientController],
  providers: [ClientService, PrismaService],
  imports: [JwtModule.register( //UserModule,
       {secret: process.env.JWT_SECRET, signOptions: {expiresIn: '3h'}
      })]
})
export class ClientModule {}
