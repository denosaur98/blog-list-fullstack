import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsModule } from './blogs/blogs.module';
import { PrismaService } from 'utils/prisma.service';

@Module({
  imports: [BlogsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}