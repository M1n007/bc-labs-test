export interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
  isRefreshToken?: boolean;
}