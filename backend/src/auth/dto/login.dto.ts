import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class Login {
  @IsString({ message: 'Почта должна быть строкой' })
  @IsNotEmpty({ message: 'Почта не может быть пустой' })
  @MinLength(10, { message: 'Почта не может быть короче 10 символов' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @MinLength(5, { message: 'Пароль не может быть короче 5 символов' })
  @MaxLength(50, { message: 'Пароль не может быть длинее 50 символов' })
  password: string;
}
