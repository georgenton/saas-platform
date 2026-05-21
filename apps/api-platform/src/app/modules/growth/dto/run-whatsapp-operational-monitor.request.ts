import { IsBoolean, IsDateString, IsInt, IsOptional, Max, Min } from 'class-validator';

export class RunWhatsappOperationalMonitorRequestDto {
  @IsOptional()
  @IsDateString()
  occurredAt?: string | null;

  @IsOptional()
  @IsBoolean()
  autoRunReadyRetries?: boolean | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  retryReadyLimit?: number | null;
}
