import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClusterService } from './cluster.service';
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.BLOCKLET_PORT || process.env.PORT || 3000;
const ENV = process.env.BLOCKLET_PORT || process.env.PORT ? 'BLOCKLET' : 'DEV';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error'],
  });

  if (ENV === 'DEV') {
    app.setGlobalPrefix('app');
  }

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      forbidNonWhitelisted: true,
      whitelist: false,
    }),
  );

  await app.listen(PORT, '0.0.0.0');
  console.log(`${ENV} is on port:`, PORT);
}

ClusterService.start(bootstrap);
