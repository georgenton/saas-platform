export interface JwtClaims {
  sub?: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  email?: string;
  provider?: string;
  externalAuthId?: string;
}
