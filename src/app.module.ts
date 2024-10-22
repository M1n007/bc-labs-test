import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpConfigService } from './config/http.config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getPostgresConfig } from './config/database.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { getThrottlerConfig } from './config/throttler.config';
import { GlobalMiddlewareModule } from './common/middleware/global-middleware.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthControllerV1 } from './modules/health/v1/controllers/health.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { CryptoModule } from 'modules/crypto/crypto.module';

@Module({
  imports: [
   
    HttpModule.registerAsync({
      useClass: HttpConfigService, // Use custom HTTP config
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // Inject ConfigSer
      useFactory: getPostgresConfig,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getThrottlerConfig,
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    AuthModule,
    TerminusModule,
    GlobalMiddlewareModule,
    CryptoModule
  ],
  controllers: [
    HealthControllerV1
  ],
  providers: [],
  exports: []
})
export class AppModule { }


