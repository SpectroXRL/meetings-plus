import { Module } from '@nestjs/common';
import { LinearService } from './linear.service';
import { AiModule } from 'src/ai/ai.module';
import { LinearController } from './linear.controller';
import { FileModule } from 'src/file/file.module';
import { FileService } from 'src/file/file.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), AiModule, FileModule],
  providers: [LinearService, FileService],
  exports: [LinearService],
  controllers: [LinearController],
})
export class LinearModule {}
