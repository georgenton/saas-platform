import { Module } from '@nestjs/common';
import { FEATURE_FLAG_REPOSITORY } from '@saas-platform/feature-flags-application';
import { PrismaModule } from '../prisma.module';
import { PrismaFeatureFlagRepository } from './prisma-feature-flag.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaFeatureFlagRepository,
    {
      provide: FEATURE_FLAG_REPOSITORY,
      useExisting: PrismaFeatureFlagRepository,
    },
  ],
  exports: [FEATURE_FLAG_REPOSITORY],
})
export class FeatureFlagsPersistenceModule {}
