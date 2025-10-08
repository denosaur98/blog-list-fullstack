import { IsString, IsNotEmpty } from "class-validator";

export class Comment {
  @IsString({ message: 'Комментарий должен быть строкой' })
  @IsNotEmpty({ message: 'Комментарий не может быть пустым' })
  text: string;
}