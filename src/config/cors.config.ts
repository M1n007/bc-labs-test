import { ConfigService } from '@nestjs/config';

export const getCorsConfig = (configService: ConfigService) => {
  return {
    origin: configService.get<string>('CORS_ORIGINS').split(','), // Dynamic based on env
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Allow cookies
    allowedHeaders: ['Authorization', 'x-refresh-token', 'refresh-token', 'Content-Type'],
  };
};
