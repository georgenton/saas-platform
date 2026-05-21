import { IsIn, IsOptional } from 'class-validator';

export class RunGrowthOperationalCaseAutoAssignmentRequestDto {
  @IsOptional()
  @IsIn(['balanced', 'owner_queue_first', 'follow_up_first'])
  policyKey?: 'balanced' | 'owner_queue_first' | 'follow_up_first';
}
