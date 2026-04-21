import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUserContext } from './authenticated-user-context';

export const AuthenticatedUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUserContext | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.authenticatedUser as AuthenticatedUserContext | undefined;
  },
);
