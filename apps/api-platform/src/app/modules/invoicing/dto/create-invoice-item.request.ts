import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateInvoiceItemRequestDto {
  @IsString()
  @MinLength(2)
  description!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsInt()
  @Min(0)
  unitPriceInCents!: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  taxRateId?: string | null;
}
