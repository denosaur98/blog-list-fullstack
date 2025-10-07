import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class Author {
  @IsString({ message: 'email должен быть строкой' })
  @IsNotEmpty({ message: 'email не может быть пустым' })
  email: string;

  @IsString({ message: 'Имя должно быть строкой' })
  @IsOptional()
  name?: string;
}