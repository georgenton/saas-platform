import { Module } from '@nestjs/common';
import {
  USER_ID_GENERATOR,
  USER_REPOSITORY,
} from '@saas-platform/identity-application';
import { PrismaModule } from '../prisma.module';
import { PrismaUserRepository } from './prisma-user.repository';
import { UuidUserIdGenerator } from './uuid-user-id.generator';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaUserRepository,
    UuidUserIdGenerator,
    {
      provide: USER_REPOSITORY,
      useExisting: PrismaUserRepository,
    },
    {
      provide: USER_ID_GENERATOR,
      useExisting: UuidUserIdGenerator,
    },
  ],
  exports: [USER_REPOSITORY, USER_ID_GENERATOR],
})
export class IdentityPersistenceModule {}
