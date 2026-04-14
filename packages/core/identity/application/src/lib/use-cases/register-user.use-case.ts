import { AuthProvider, User } from '@saas-platform/identity-domain';
import { UserIdGenerator } from '../ports/user-id.generator';
import { UserRepository } from '../ports/user.repository';

export interface RegisterUserCommand {
  email: string;
  authProvider: AuthProvider;
  name?: string | null;
  avatarUrl?: string | null;
  externalAuthId?: string | null;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userIdGenerator: UserIdGenerator,
  ) {}

  async execute(command: RegisterUserCommand): Promise<User> {
    const normalizedEmail = command.email.trim().toLowerCase();
    const existingUser = await this.userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      return existingUser;
    }

    const now = new Date();
    const user = User.create({
      id: this.userIdGenerator.generate(),
      email: normalizedEmail,
      name: command.name ?? null,
      avatarUrl: command.avatarUrl ?? null,
      authProvider: command.authProvider,
      externalAuthId: command.externalAuthId ?? null,
      createdAt: now,
      updatedAt: now,
    });

    await this.userRepository.save(user);

    return user;
  }
}
