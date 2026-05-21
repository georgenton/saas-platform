import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class AcknowledgeWhatsappOperationalAlertRequestDto {
  @IsString()
  @MaxLength(160)
  title!: string;

  @IsIn(['warning', 'critical'])
  severity!: 'warning' | 'critical';

  @IsString()
  @MaxLength(1000)
  summary!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  provider?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  failureClass?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  providerTaxonomyFamily?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  providerTaxonomyDetail?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  affectedMessageCount?: number | null;

  @IsString()
  @MaxLength(1000)
  recommendedAction!: string;

  @IsOptional()
  @IsDateString()
  lastSeenGeneratedAt?: string | null;
}
