import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import { NotFoundException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { TransformHttpResponseInterceptor } from './common/interceptors/http-response.interceptor';
import { InternalLogFilter } from './common/logger/internal-log-filter';
import { WsRedisIoAdapter } from './ws/adapter/ws-redis.adapter';

const fs = require('fs');
const path = require('path');

async function bootstrap() {
  const envData = Object.entries(process.env)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const outputPath = path.join(__dirname + '/../../..', '.env');

  fs.writeFile(outputPath, envData, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log(`Environment variables saved to ${outputPath}`);
    }
  });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      ignoreTrailingSlash: true,
      ignoreDuplicateSlashes: true,
      maxParamLength: 500,
    }),
    {
      logger: new InternalLogFilter(),
    },
  );

  app.setGlobalPrefix('api');

  const redisIoAdapter = new WsRedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  await app.register(fastifyMultipart as any);
  await app.register(fastifyCookie as any);

  app
    .getHttpAdapter()
    .getInstance()
    .addHook('preHandler', function (req, reply, done) {
      if (
        req.originalUrl.startsWith('/api') &&
        !req.originalUrl.startsWith('/api/auth/setup') &&
        !req.originalUrl.startsWith('/api/health')
      ) {
        if (!req.raw?.['workspaceId']) {
          throw new NotFoundException('Workspace not found');
        }
        done();
      } else {
        done();
      }
    });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      transform: true,
    }),
  );

  app.enableCors();

  app.useGlobalInterceptors(new TransformHttpResponseInterceptor());
  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

bootstrap();
