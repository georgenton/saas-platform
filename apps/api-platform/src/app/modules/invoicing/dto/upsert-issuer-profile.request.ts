import { IsBoolean, IsIn, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class UpsertIssuerProfileRequestDto {
  @IsString()
  @MinLength(1)
  legalName!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  commercialName?: string | null;

  @IsString()
  @Length(13, 13)
  taxId!: string;

  @IsIn(['test', 'production'])
  environment!: 'test' | 'production';

  @IsOptional()
  @IsIn(['normal'])
  emissionType?: 'normal';

  @IsBoolean()
  accountingObligated!: boolean;

  @IsOptional()
  @IsString()
  @MinLength(1)
  specialTaxpayerCode?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  rimpeTaxpayerType?: string | null;

  @IsString()
  @MinLength(1)
  matrixAddress!: string;

  @IsString()
  @MinLength(1)
  establishmentAddress!: string;
}
