import { IsString, MaxLength } from 'class-validator';

export class ExecuteAiGuardedExecutionRequestDto {
  @IsString()
  @MaxLength(120)
  caseId!: string;
}
