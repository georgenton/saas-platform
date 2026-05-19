import { IsIn } from 'class-validator';
import { OpportunityStage } from '@saas-platform/growth-domain';

const opportunityStages: OpportunityStage[] = [
  'new',
  'discovery',
  'proposal',
  'negotiation',
  'won',
  'lost',
];

export class UpdateOpportunityStageRequestDto {
  @IsIn(opportunityStages)
  stage!: OpportunityStage;
}
