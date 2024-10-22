import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from 'config/jwt.config';
import { validate } from './validations/env.validation';
import { PaginationService } from './services/pagination.service';
import { HashService } from './services/hash.service';
import { TransactionManagerService } from './services/transaction-manager.service';
import Moralis from 'moralis';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  providers: [
    PaginationService,
    HashService,
    TransactionManagerService,
    {
      provide: 'MORALIS',
      useFactory: async (configService: ConfigService) => {
        const apiKey = configService.get<string>('MORALIS_API_KEY');
        if (!apiKey) {
          throw new Error('Moralis API key is not defined in environment variables.');
        }

        await Moralis.start({ apiKey });
        return Moralis;
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    PaginationService,
    HashService,
    JwtModule,
    TransactionManagerService,
    'MORALIS'
  ],
})
export class CommonModule {}
