import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength } from "class-validator";

export class Register {
  @IsString({ message: 'Почта должна быть строкой' })
  @IsNotEmpty({ message: 'Почта не может быть пустой' })
  @MinLength(10, { message: 'Почта не может быть короче 10 символов' })
  email: string;

  @IsString({ message: 'Имя должно быть строкой' })
  @MinLength(2, { message: 'Имя не может быть короче 2 символов' })
  @MaxLength(20, { message: 'Имя не может быть длинее 20 символов' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @MinLength(5, { message: 'Пароль не может быть короче 5 символов' })
  @MaxLength(50, { message: 'Пароль не может быть длинее 50 символов' })
  password: string;
}
