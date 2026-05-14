import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

const BUYER_IDENTIFICATION_TYPES = ['04', '05', '06', '07', '08'] as const;

export class CreateRemissionGuideRequestDto {
  @IsString()
  @MinLength(1)
  sourceInvoiceId!: string;

  @IsString()
  @MinLength(3)
  shipmentReason!: string;

  @IsDateString()
  shipmentStartAt!: string;

  @IsDateString()
  shipmentEndAt!: string;

  @IsString()
  @MinLength(5)
  departureAddress!: string;

  @IsString()
  @MinLength(5)
  arrivalAddress!: string;

  @IsString()
  @MinLength(3)
  carrierName!: string;

  @IsIn(BUYER_IDENTIFICATION_TYPES)
  carrierIdentificationType!: (typeof BUYER_IDENTIFICATION_TYPES)[number];

  @IsString()
  @MinLength(5)
  carrierIdentification!: string;

  @IsString()
  @Matches(/^[A-Za-z0-9-]{5,12}$/)
  vehiclePlate!: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  destinationRoute?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  number?: string;

  @IsOptional()
  @IsDateString()
  issuedAt?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  notes?: string | null;
}
