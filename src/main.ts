import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';
import * as express from 'express';
import * as httpContext from 'express-http-context';
import { appConfiguration, initializeSwagger } from './app.configuration';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filter/http-exception.filter';
import { MongoExceptionFilter } from './filter/mongodb-exception.filter';
import { setCorrelationId } from './shared/utils';
import { Logger } from '@nestjs/common';
import { CustomLogger } from './logger/custom-logger.logger';
import { LoggingInterceptor } from './interceptor/logging.interceptor';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useLogger(app.get(CustomLogger));
  app.useGlobalInterceptors(new LoggingInterceptor());

  const configService = app.get(ConfigService);
  const appConfig = appConfiguration(configService);

  app.use(helmet());
  app.enableCors(appConfig.cors);
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalFilters(new MongoExceptionFilter());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.set('trust proxy', 1);
  app.use(httpContext.middleware);
  app.use(setCorrelationId);

  initializeSwagger(app, configService);
  await app.listen(configService.get('app.port'));
}
bootstrap();

process.on('uncaughtException', (error) => {
  logger.error(
    `UNCAUGHT EXCEPTION - keeping process alive:\n ${
      error.stack
    }\n ${JSON.stringify(error)}`,
  );
});
