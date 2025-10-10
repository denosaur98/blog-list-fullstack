import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { FileUploadService } from 'utils/file-upload.service';

export function AvatarUploadInterceptor(userId: string): Type<NestInterceptor> {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    constructor(private fileUploadService: FileUploadService) {}

    intercept(context: any, next: any) {
      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination: this.fileUploadService.imagePath,
          filename: (req, file, callback) => {
            const fileName = this.fileUploadService.generateFileName(
              file.originalname,
              userId
            );
            callback(null, fileName)
          },
        }),
        limits: {
          fileSize: 5 * 1024 * 1024
        },
        fileFilter: (req, file: any, callback) => {
          try {
            this.fileUploadService.validateFile(file)
            callback(null, true)
          } catch (error) {
            callback(error, false)
          }
        },
      }

      const fileInterceptor = new (FileInterceptor('avatar', multerOptions))()
      return fileInterceptor.intercept(context, next)
    }
  }

  return mixin(MixinInterceptor)
}