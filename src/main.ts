import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import {
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { AppUtils } from './common/helpers';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import chalk from 'chalk';
import { InternalDisabledLogger } from './shared/infrastructure/logging';
import { LoggerErrorInterceptor } from 'nestjs-pino';


declare const module: {
  hot: { accept: () => void, dispose: (argument: () => Promise<void>) => void }
}

const logger = new Logger("Bootstrap")


async function bootstrap(): Promise<void> {
  const fastifyAdapter = new FastifyAdapter({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: false,
        },
      },
    },
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      logger: new InternalDisabledLogger(),
      snapshot: true,
    },
  );

  const configService = app.get(ConfigService)

  app.useGlobalPipes(
    new ValidationPipe(AppUtils.validationPipeOptions()),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalInterceptors(new LoggerErrorInterceptor())

  app.enableShutdownHooks()

  AppUtils.killAppWithGrace(app)

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  if (module?.hot != null) {
    module.hot.accept()
    module.hot.dispose(async () => app.close())
  }

  const port = process.env.PORT ?? configService.get<number>('appConfig.port');
  await app.listen(port);
  const appUrl = `http://localhost:${port}`;

  logger.log(`==========================================================`)
  logger.log(`🚀 Application is running on: ${chalk.green(appUrl)}`)

  logger.log(`==========================================================`)
}

try {
  (async () => bootstrap())()
}
catch (error) {
  logger.error(error)
}