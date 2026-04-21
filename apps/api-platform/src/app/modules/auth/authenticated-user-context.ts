export interface AuthenticatedUserContext {
  id: string;
  email: string | null;
  provider: string | null;
  externalAuthId: string | null;
}
