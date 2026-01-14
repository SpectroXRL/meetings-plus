import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { FileService } from './file/file.service';
import { AiService } from './ai/ai.service';
import { LinearService } from './linear/linear.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly fileService: FileService,
    private readonly aiService: AiService,
    private readonly linearService: LinearService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/transcript')
  @UseInterceptors(FileInterceptor('transcript'))
  async postTranscript(
    @UploadedFile()
    file?: Express.Multer.File,
  ): Promise<void> {
    const content = this.fileService.processContent(file);
    await this.linearService.createIssues(content);
  }
}
