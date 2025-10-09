import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'utils/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsModule } from './blogs/blogs.module';
import { AuthModule } from './auth/auth.module';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: '2-0vsz#wuzah2qinb3a5!%5b_#1!q_236&-m-5-7e4@2ch6s$a',
      signOptions: { expiresIn: '24h' }
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    BlogsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtStrategy],
  exports: [PrismaService, JwtModule, PassportModule, JwtStrategy]
})
export class AppModule {}