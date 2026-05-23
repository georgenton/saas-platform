import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class ReviewAiApprovalRequestRequestDto {
  @IsIn(['approved', 'rejected'])
  status!: 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reviewNote?: string | null;
}
