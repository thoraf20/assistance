import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateAssistanceDto {
  @IsString()
  public category_id: string;

  @IsString()
  public user_id: string;

  @IsArray()
  public organizer: [];

  @IsString()
  @IsOptional()
  public beneficiary: string;

  @IsString()
  public title: string;

  @IsString()
  public purpose: string;

  @IsString()
  public imgUrl: string;

  @IsNumber()
  public target_amount: number;

  @IsNumber()
  @IsOptional()
  public donated_amount: number;

}
