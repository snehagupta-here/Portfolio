import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ContactUsBody {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsString()
  message!: string;
}
