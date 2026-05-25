import { Module } from '@nestjs/common';
import {
  AI_APPROVAL_REQUEST_REPOSITORY,
  AI_GUARDED_EXECUTION_EVENT_REPOSITORY,
  AI_SUGGESTION_RUN_REPOSITORY,
} from '@saas-platform/ai-application';
import { PrismaModule } from '../prisma.module';
import { PrismaAiApprovalRequestRepository } from './prisma-ai-approval-request.repository';
import { PrismaAiGuardedExecutionEventRepository } from './prisma-ai-guarded-execution-event.repository';
import { PrismaAiSuggestionRunRepository } from './prisma-ai-suggestion-run.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaAiApprovalRequestRepository,
    PrismaAiGuardedExecutionEventRepository,
    PrismaAiSuggestionRunRepository,
    {
      provide: AI_APPROVAL_REQUEST_REPOSITORY,
      useExisting: PrismaAiApprovalRequestRepository,
    },
    {
      provide: AI_GUARDED_EXECUTION_EVENT_REPOSITORY,
      useExisting: PrismaAiGuardedExecutionEventRepository,
    },
    {
      provide: AI_SUGGESTION_RUN_REPOSITORY,
      useExisting: PrismaAiSuggestionRunRepository,
    },
  ],
  exports: [
    AI_APPROVAL_REQUEST_REPOSITORY,
    AI_GUARDED_EXECUTION_EVENT_REPOSITORY,
    AI_SUGGESTION_RUN_REPOSITORY,
  ],
})
export class AiPersistenceModule {}
