import { IsNumber, IsOptional, IsString, isBoolean } from 'class-validator';

export class CreateDonorDto {
  @IsString()
  public assistance_id: string;

  @IsString()
  public reference: string;
}

export class GetDonorsDto {
  @IsNumber()
  @IsOptional()
  public page: number;

  @IsNumber()
  @IsOptional()
  public per_page: number;

  // @isBoolean()
  @IsOptional()
  public topDonors: boolean;
}
