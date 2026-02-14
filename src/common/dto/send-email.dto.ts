import {
  IsEmail,
  IsString,
  IsArray,
  IsNotEmpty,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import IsCustomString from '../decorators/is-custom-string';

export class SendEmailDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsEmail({}, { each: true })
  @IsNotEmpty({ each: true })
  to: string[];

  @IsCustomString()
  subject: string;

  @IsCustomString()
  body: string;

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  cc?: string[];
}
