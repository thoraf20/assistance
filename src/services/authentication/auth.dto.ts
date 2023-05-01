import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';

export class EmailVerificationDto {
  @IsEmail()
  email: string;
  @IsString()
  code: string;
}

export class LogInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}