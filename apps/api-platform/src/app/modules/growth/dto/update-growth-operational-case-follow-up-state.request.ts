import { IsDateString, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateGrowthOperationalCaseFollowUpStateRequestDto {
  @IsIn(['pending_team', 'scheduled', 'waiting_customer'])
  followUpState!: 'pending_team' | 'scheduled' | 'waiting_customer';

  @IsOptional()
  @IsString()
  @MaxLength(280)
  nextAction?: string | null;

  @IsOptional()
  @IsDateString()
  dueAt?: string | null;
}
