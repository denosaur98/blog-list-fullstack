import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBlog {
  @IsString({ message: 'Название должно быть строкой' })
  @IsOptional()
  title?: string;

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional()
  description?: string;
}