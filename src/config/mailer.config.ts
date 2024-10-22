import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';

export const getMailerConfig = (configService: ConfigService): MailerOptions => {
  return {
    transport: {
      host: configService.get<string>('SMTP_HOST'),
      port: configService.get<number>('SMTP_PORT'),
      secure: configService.get<number>('SMTP_SECURE'),
      auth: {
        user: configService.get<string>('SMTP_USER'),
        pass: configService.get<string>('SMTP_PASS'),
      },
    },
    defaults: {
      from: configService.get<string>('SMTP_FROM'),
    },
  };
};
