import { AuthenticatedUserContext } from '../authenticated-user-context';

export interface AuthenticatedUserResponseDto {
  id: string;
  email: string | null;
  provider: string | null;
  externalAuthId: string | null;
}

export const toAuthenticatedUserResponseDto = (
  authenticatedUser: AuthenticatedUserContext,
): AuthenticatedUserResponseDto => ({
  id: authenticatedUser.id,
  email: authenticatedUser.email,
  provider: authenticatedUser.provider,
  externalAuthId: authenticatedUser.externalAuthId,
});
