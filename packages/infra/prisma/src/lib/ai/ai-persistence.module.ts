import { Module } from '@nestjs/common';
import { AI_SUGGESTION_RUN_REPOSITORY } from '@saas-platform/ai-application';
import { PrismaModule } from '../prisma.module';
import { PrismaAiSuggestionRunRepository } from './prisma-ai-suggestion-run.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaAiSuggestionRunRepository,
    {
      provide: AI_SUGGESTION_RUN_REPOSITORY,
      useExisting: PrismaAiSuggestionRunRepository,
    },
  ],
  exports: [AI_SUGGESTION_RUN_REPOSITORY],
})
export class AiPersistenceModule {}
