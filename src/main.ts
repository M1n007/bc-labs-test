import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { getCorsConfig } from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: WinstonModule.createLogger(winstonConfig),
  });
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.use(cookieParser());

  app.enableCors(getCorsConfig(configService));
  app.setGlobalPrefix('')

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();



  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger-docs', app, document);

  await app.listen(configService.get<number>('PORT'));
}

void bootstrap();