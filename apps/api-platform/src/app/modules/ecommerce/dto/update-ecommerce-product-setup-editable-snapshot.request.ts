import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateEcommerceProductSetupEditableSnapshotRequestDto {
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  pricingBand?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(280)
  offerAngle?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  primaryCta?: string | null;

  @IsArray()
  @IsString({ each: true })
  @MaxLength(160, { each: true })
  channelSequence!: string[];
}
