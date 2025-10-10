import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';

export function AvatarUploadInterceptor(): Type<NestInterceptor> {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    intercept(context: any, next: any) {
      const request = context.switchToHttp().getRequest()
      const userId = request.params.id

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination: './uploads/users',
          filename: (req, file, callback) => {
            const fileExtension = file.originalname.split('.').pop()
            const timestamp = Date.now()
            const randomString = Math.random().toString(36).substring(2, 15)
            const fileName = `avatar_${userId}_${timestamp}_${randomString}.${fileExtension}`
            callback(null, fileName)
          },
        }),
        limits: {
          fileSize: 5 * 1024 * 1024,
        },
        fileFilter: (req, file, callback) => {
          if (!file.mimetype.startsWith('image/')) {
            return callback(new BadRequestException('Only image files are allowed'), false)
          }
          callback(null, true)
        },
      }

      const fileInterceptor = new (FileInterceptor('avatar', multerOptions))()
      return fileInterceptor.intercept(context, next)
    }
  }

  return mixin(MixinInterceptor)
}