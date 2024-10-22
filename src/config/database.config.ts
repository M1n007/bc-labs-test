import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getPostgresConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get<string>('POSTGRES_HOST'),
    port: configService.get<number>('POSTGRES_PORT'),
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASS'),
    database: configService.get<string>('POSTGRES_NAME'),
    entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
    synchronize: configService.get<boolean>('POSTGRES_TYPEORM_SYNCHRONIZE'),
    dropSchema: configService.get<boolean>('POSTGRES_TYPEORM_DROP_SCHEMA')
  }
};

