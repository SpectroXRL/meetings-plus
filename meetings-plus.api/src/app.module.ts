import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { AiModule } from './ai/ai.module';
import { SchemabuilderService } from './schemabuilder/schemabuilder.service';

@Module({
  imports: [ConfigModule.forRoot(), FileModule, AiModule],
  controllers: [AppController],
  providers: [AppService, SchemabuilderService],
})
export class AppModule {}
