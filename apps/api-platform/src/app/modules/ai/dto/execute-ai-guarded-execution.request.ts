import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ExecuteAiGuardedExecutionRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  caseId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  invoiceId?: string;
}
