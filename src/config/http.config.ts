// src/config/http.config.ts
import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: 5000, // 5 seconds timeout
      maxRedirects: 5,
      headers: {
        'User-Agent': 'bc-labs-test-API',
      },
    };
  }
}
