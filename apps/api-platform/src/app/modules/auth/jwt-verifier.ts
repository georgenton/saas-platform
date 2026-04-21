import { JwtClaims } from './jwt-claims';

export interface JwtVerifier {
  verify(token: string): JwtClaims;
}

export const JWT_VERIFIER = Symbol('JWT_VERIFIER');
