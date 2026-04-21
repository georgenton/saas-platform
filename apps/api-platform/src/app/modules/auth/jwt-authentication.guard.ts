import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedUserContext } from './authenticated-user-context';
import { JwtVerifier, JWT_VERIFIER } from './jwt-verifier';

@Injectable()
export class JwtAuthenticationGuard implements CanActivate {
  constructor(
    @Inject(JWT_VERIFIER)
    private readonly jwtVerifier: JwtVerifier,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization as
      | string
      | undefined;

    if (!authorizationHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization Bearer token is required.',
      );
    }

    const token = authorizationHeader.slice('Bearer '.length).trim();

    if (!token) {
      throw new UnauthorizedException('Authorization Bearer token is required.');
    }

    const claims = this.jwtVerifier.verify(token);

    if (!claims.sub) {
      throw new UnauthorizedException('JWT subject claim is required.');
    }

    const authenticatedUser: AuthenticatedUserContext = {
      id: claims.sub,
      email: claims.email ?? null,
      provider: claims.provider ?? null,
      externalAuthId: claims.externalAuthId ?? null,
    };

    request.authenticatedUser = authenticatedUser;

    return true;
  }
}
