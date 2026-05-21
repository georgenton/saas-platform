import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  GrowthOperationalCasePriority,
  GrowthOperationalCaseType,
} from '@saas-platform/growth-application';

export class CreateGrowthOperationalCaseRequestDto {
  @IsString()
  @MaxLength(160)
  sourceKey!: string;

  @IsIn(['alert_escalation', 'ownership_routing', 'follow_up'])
  caseType!: GrowthOperationalCaseType;

  @IsIn(['warning', 'critical'])
  priority!: GrowthOperationalCasePriority;

  @IsString()
  @MaxLength(160)
  title!: string;

  @IsString()
  @MaxLength(500)
  summary!: string;

  @IsString()
  @MaxLength(500)
  nextAction!: string;

  @IsOptional()
  @IsIn(['pending_team', 'scheduled', 'waiting_customer'])
  followUpState?: 'pending_team' | 'scheduled' | 'waiting_customer';

  @IsOptional()
  @IsString()
  @MaxLength(160)
  threadId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  alertKey?: string | null;

  @IsOptional()
  @IsDateString()
  dueAt?: string | null;
}
