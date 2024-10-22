import { ConfigService } from '@nestjs/config';

export const getMoralisApi = (configService: ConfigService) => {
  const apiKey = configService.get<string>('MORALIS_API_KEY');

  if (!apiKey) {
    throw new Error('Moralis API key is not defined in environment variables.');
  }

  return apiKey
};
