import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateDonorDto {
  @IsString()
  public assistance_id: string;

  @IsString()
  public reference: string;

}
