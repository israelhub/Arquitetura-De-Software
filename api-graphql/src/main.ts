import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
  Logger.log(`🚀 GraphQL API rodando em http://localhost:3001/graphql`, 'Bootstrap');
}
bootstrap();
