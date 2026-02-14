import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as requestIp from 'request-ip';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ exposedHeaders: [] });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(requestIp.mw());
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
