import { IsString, IsNotEmpty, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Author } from './author.dto';

export class CreateBlog {
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  title: string;

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional()
  description: string;

  @IsObject({ message: 'Автор должен быть объектом' })
  @ValidateNested()
  @Type(() => Author)
  author: Author;
}