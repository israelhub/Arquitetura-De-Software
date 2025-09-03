import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilmeModule } from './filmes/filme.module';
import { AtorModule } from './atores/ator.module';

@Module({
  imports: [FilmeModule, AtorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
