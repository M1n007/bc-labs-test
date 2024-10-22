import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

// Define possible environments
enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentConfigDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  PORT: number;

  @IsEnum(Environment)
  NODE_ENV: Environment;

  // PostgreSQL configuration
  @IsString()
  POSTGRES_HOST: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  POSTGRES_PORT: number;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASS: string;

  @IsString()
  POSTGRES_NAME: string;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  POSTGRES_TYPEORM_SYNCHRONIZE: boolean;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  POSTGRES_TYPEORM_DROP_SCHEMA: boolean;

  // JWT configuration
  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRES_IN: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  JWT_REFRESH_EXPIRES_IN: string;

  // CORS configuration
  @IsString()
  CORS_ORIGINS: string;

  // Throttle configuration
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  THROTTLE_TTL: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  THROTTLE_LIMIT: number;

  // SMTP Config
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  SMTP_SECURE: boolean;

  @IsString()
  SMTP_HOST: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  SMTP_PORT: number;

  @IsString()
  SMTP_USER: string;

  @IsString()
  SMTP_PASS: string;

  @IsString()
  SMTP_FROM: string;

  // Coingecko configuration
  @IsString()
  COINGECKO_API_URL: string;

  @IsString()
  COINGECKO_API_KEY: string;

  // moralis configuration
  @IsString()
  MORALIS_API_KEY: string;
}
