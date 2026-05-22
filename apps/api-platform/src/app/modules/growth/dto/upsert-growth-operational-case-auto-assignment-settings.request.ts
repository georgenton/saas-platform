import { IsIn } from 'class-validator';

export class UpsertGrowthOperationalCaseAutoAssignmentSettingsRequestDto {
  @IsIn(['balanced', 'owner_queue_first', 'follow_up_first'])
  defaultPolicyKey!: 'balanced' | 'owner_queue_first' | 'follow_up_first';
}
