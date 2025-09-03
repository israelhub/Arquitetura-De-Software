import { Module } from '@nestjs/common';
import { AtorController } from './ator.controller';
import { AtorService } from './ator.service';

@Module({
  controllers: [AtorController],
  providers: [AtorService],
})
export class AtorModule {}
