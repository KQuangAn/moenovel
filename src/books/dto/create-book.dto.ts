// src/books/dto/upload-book.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  readonly fileName: string;
  
}
