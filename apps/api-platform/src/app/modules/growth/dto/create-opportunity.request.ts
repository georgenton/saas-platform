import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { OpportunityStage } from '@saas-platform/growth-domain';

const opportunityStages: OpportunityStage[] = [
  'new',
  'discovery',
  'proposal',
  'negotiation',
  'won',
  'lost',
];

export class CreateOpportunityRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  leadId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  threadId?: string | null;

  @IsString()
  @MaxLength(160)
  title!: string;

  @IsOptional()
  @IsIn(opportunityStages)
  stage?: OpportunityStage | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  amountInCents?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  currency?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string | null;
}
