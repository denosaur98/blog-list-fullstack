import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class Register {
  @IsString({ message: 'Почта должна быть строкой' })
  @IsNotEmpty({ message: 'Почта не может быть пустой' })
  email: string;

  @IsString({ message: 'Имя должно быть строкой' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  password: string;
}
