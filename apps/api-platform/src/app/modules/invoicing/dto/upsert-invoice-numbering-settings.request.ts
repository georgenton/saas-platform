import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class UpsertInvoiceNumberingSettingsRequestDto {
  @IsOptional()
  @IsString()
  @Length(2, 2)
  documentCode?: string;

  @IsString()
  @Length(3, 3)
  establishmentCode!: string;

  @IsString()
  @Length(3, 3)
  emissionPointCode!: string;

  @IsInt()
  @Min(1)
  nextSequenceNumber!: number;
}
