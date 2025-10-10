import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileUploadService {
  readonly imagePath = join(process.cwd(), 'uploads', 'users')

  constructor() {
    this.createUploadDirs()
  }

  private createUploadDirs() {
    if(!existsSync(this.imagePath)) {
      mkdirSync(this.imagePath, { recursive: true })
    }
  }

  generateFileName(originalName: string, userId: string): string {
    const fileExtension = originalName.split('.').pop()
    const timestamp = Date.now()

    return `image_${userId}_${timestamp}.${fileExtension}`
  }

  getImagePath(filename: string): string {
    return join(this.imagePath, filename)
  }

  getImageUrl(filename: string): string {
    return `/uploads/users/${filename}`
  }

  validateFile(file: Express.Multer.File): void {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if(!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException({ message: 'Недопустимый формат файла. Загрузите изображение формата: JPEG, PNG, GIF, WebP' })
    }

    const maxSize = 5 * 1024 * 1024
    if(file.size > maxSize) {
      throw new BadRequestException({ message: 'Файл слишком большой. Максимальный размер: 5MB' })
    }
  }
}