import { Module } from '@nestjs/common';
import { LinearService } from './linear.service';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [LinearService],
  exports: [LinearService],
})
export class LinearModule {}
