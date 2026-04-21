import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedUserContext } from './authenticated-user-context';

@Injectable()
export class DevelopmentAuthenticationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'] as string | undefined;

    if (!userId) {
      throw new UnauthorizedException(
        'x-user-id header is required for development authentication.',
      );
    }

    const authenticatedUser: AuthenticatedUserContext = {
      id: userId,
    };

    request.authenticatedUser = authenticatedUser;

    return true;
  }
}
