import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
  app.enableCors({
    origin: allowedOrigin,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
