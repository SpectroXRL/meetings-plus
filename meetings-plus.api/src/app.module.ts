import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { AiModule } from './ai/ai.module';
import { SchemabuilderService } from './schemabuilder/schemabuilder.service';
import { LinearService } from './linear/linear.service';
import { LinearModule } from './linear/linear.module';

@Module({
  imports: [ConfigModule.forRoot(), FileModule, AiModule, LinearModule],
  controllers: [AppController],
  providers: [AppService, SchemabuilderService, LinearService],
})
export class AppModule {}
