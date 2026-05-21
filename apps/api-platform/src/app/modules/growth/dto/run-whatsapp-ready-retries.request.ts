import { IsDateString, IsInt, IsOptional, Max, Min } from 'class-validator';

export class RunWhatsappReadyRetriesRequestDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number | null;

  @IsOptional()
  @IsDateString()
  occurredAt?: string | null;
}
