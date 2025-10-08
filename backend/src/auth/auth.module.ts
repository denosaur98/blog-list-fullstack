import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'utils/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: '2-0vsz#wuzah2qinb3a5!%5b_#1!q_236&-m-5-7e4@2ch6s$a',
      signOptions: { expiresIn: '24h' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
