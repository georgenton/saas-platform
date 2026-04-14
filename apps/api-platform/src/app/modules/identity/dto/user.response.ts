import { User } from '@saas-platform/identity-domain';

export interface UserResponseDto {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  authProvider: string;
  externalAuthId: string | null;
  createdAt: string;
  updatedAt: string;
}

export function toUserResponseDto(user: User): UserResponseDto {
  const data = user.toPrimitives();

  return {
    id: data.id,
    email: data.email,
    name: data.name ?? null,
    avatarUrl: data.avatarUrl ?? null,
    authProvider: data.authProvider,
    externalAuthId: data.externalAuthId ?? null,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
}
