import { IsString, IsNotEmpty, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Author } from "./author.dto";

export class Comment {
  @IsString({ message: 'Комментарий должен быть строкой' })
  @IsNotEmpty({ message: 'Комментарий не может быть пустым' })
  text: string;

  @IsObject({ message: 'Автор должен быть объектом' })
  @ValidateNested()
  @Type(() => Author)
  author: Author
}