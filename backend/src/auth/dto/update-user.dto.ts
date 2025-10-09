import { IsString, IsOptional } from "class-validator";

export class UpdateUser {
  @IsString({ message: 'Почта должна быть строкой' })
  @IsOptional()
  email: string;

  @IsString({ message: 'Имя должно быть строкой' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsOptional()
  password: string;
}
