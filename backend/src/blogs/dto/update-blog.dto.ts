import { IsString, IsOptional, ValidateNested } from 'class-validator';

export class UpdateBlog {
  @IsString({ message: 'Название должно быть строкой' })
  @IsOptional()
  title?: string;

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional()
  description?: string;
}