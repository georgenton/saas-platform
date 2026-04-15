import { User } from '@saas-platform/identity-domain';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { UserRepository } from '../ports/user.repository';

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError(id);
    }

    return user;
  }
}
