import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/transcript')
  @UseInterceptors(FileInterceptor('transcript'))
  postTranscript(
    @UploadedFile()
    file?: Express.Multer.File,
  ): void {
    console.log(file);
    const content = (file as { buffer: Buffer } | undefined)?.buffer.toString(
      'utf-8',
    );
    console.log(content);
  }
}
