import { IsBoolean, IsNumber, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateTaxRateRequestDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  percentage!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
