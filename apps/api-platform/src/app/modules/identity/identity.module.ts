import { Module } from '@nestjs/common';
import {
  GetUserByIdUseCase,
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
      provide: GetUserByIdUseCase,
      inject: [USER_REPOSITORY],
      useFactory: (userRepository) => new GetUserByIdUseCase(userRepository),
    },
    {
      provide: RegisterUserUseCase,
      inject: [USER_REPOSITORY, USER_ID_GENERATOR],
      useFactory: (userRepository, userIdGenerator) =>
        new RegisterUserUseCase(userRepository, userIdGenerator),
    },
  ],
  exports: [GetUserByIdUseCase, RegisterUserUseCase],
})
export class IdentityModule {}
