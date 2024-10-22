import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoController } from './v1/controllers/crypto.controller';
import { CryptoService } from './v1/services/crypto.service';
import { Price } from 'entities/price.entity';
import { EmailService } from './v1/services/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { getMailerConfig } from 'config/mailer.config';
import { PriceHistory } from 'entities/price-history.entity';
import { PriceAlert } from 'entities/price-alert.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Price, PriceHistory, PriceAlert]),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getMailerConfig,
    }),
    HttpModule
  ],
  providers: [CryptoService, EmailService],
  controllers: [CryptoController],
})
export class CryptoModule {}
