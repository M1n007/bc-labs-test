import { ConfigService } from '@nestjs/config';

export const getThrottlerConfig = (configService: ConfigService) => {
  return [
    {
      ttl: configService.get<number>('THROTTLE_TTL', 60), // Time to live in seconds
      limit: configService.get<number>('THROTTLE_LIMIT', 10), // Maximum number of requests per TTL
    }
  ];
};