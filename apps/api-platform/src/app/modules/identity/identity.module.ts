import { Module } from '@nestjs/common';
import {
  RegisterUserUseCase,
  USER_ID_GENERATOR,
  USER_REPOSITORY,
} from '@saas-platform/identity-application';
import { IdentityPersistenceModule } from '@saas-platform/infra-prisma';
import { IdentityController } from './identity.controller';

@Module({
  imports: [IdentityPersistenceModule],
  controllers: [IdentityController],
  providers: [
    {
      provide: RegisterUserUseCase,
      inject: [USER_REPOSITORY, USER_ID_GENERATOR],
      useFactory: (userRepository, userIdGenerator) =>
        new RegisterUserUseCase(userRepository, userIdGenerator),
    },
  ],
  exports: [RegisterUserUseCase],
})
export class IdentityModule {}
