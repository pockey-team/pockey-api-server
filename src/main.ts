import fastifyCompress from '@fastify/compress';
import cors from '@fastify/cors';
import { fastifyHelmet } from '@fastify/helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { JwtAuthGuard } from './framework/auth/guard';
import { setupSwagger } from './framework/config/swagger.config';
import { WinstonLogger } from './framework/config/winstone.logger';
import { AppModule } from './framework/module/app.module';

const logger = new Logger('bootstrap');

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();

  await fastifyAdapter.register(cors, {
    origin: ['*'],
    credentials: true,
  });

  await fastifyAdapter.register(fastifyHelmet, {
    contentSecurityPolicy: false,
  });

  await fastifyAdapter.register(fastifyCompress, {
    threshold: 1024,
    encodings: ['br', 'gzip'],
    global: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter, {
    logger: new WinstonLogger(),
  });

  const jwtAuthGuard = app.get(JwtAuthGuard);
  app.useGlobalGuards(jwtAuthGuard);

  setupSwagger(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
