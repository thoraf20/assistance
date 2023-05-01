import { IsOptional, IsString, ValidateNested } from 'class-validator';
// import CreateAddressDto from './address.dto';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  public full_name: string;

  @IsString()
  public email: string;

  @IsString()
  public password: string;

}


export class ResetPasswordDto {
  email: string;
  code: string;
  password: string;
}