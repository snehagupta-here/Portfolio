import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty({ message: 'email: email is required' })
  @IsEmail({}, { message: 'email: email must be a valid email address' })
  email!: string;

  @IsString({ message: 'password: password must be a string' })
  @IsNotEmpty({ message: 'password: password is required' })
  @MinLength(8, {
    message: 'password: password must be at least 8 characters long',
  })
  password!: string;
}

export class AuthRegisterDto {
  @IsString({ message: 'name: name must be a string' })
  @IsNotEmpty({ message: 'name: name is required' })
  name!: string;

  @IsNotEmpty({ message: 'email: email is required' })
  @IsEmail({}, { message: 'email: email must be a valid email address' })
  email!: string;

  @IsString({ message: 'password: password must be a string' })
  @IsNotEmpty({ message: 'password: password is required' })
  @MinLength(8, {
    message: 'password: password must be at least 8 characters long',
  })
  password!: string;
}
