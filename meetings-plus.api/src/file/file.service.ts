import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  processContent(file?: Express.Multer.File): string | undefined {
    const content = (file as { buffer: Buffer } | undefined)?.buffer.toString(
      'utf-8',
    );

    return content;
  }
}
