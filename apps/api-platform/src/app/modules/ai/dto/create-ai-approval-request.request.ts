import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAiApprovalRequestRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  rationale?: string | null;
}
