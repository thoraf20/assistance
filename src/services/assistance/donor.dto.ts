import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateDonorDto {
  @IsString()
  public assistance_id: string;

  @IsString()
  public name: string;

  @IsNumber()
  public donated_amount: number;

}
