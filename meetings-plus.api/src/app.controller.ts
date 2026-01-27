import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { FileService } from './file/file.service';
import { LinearService } from './linear/linear.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

const REDIRECT_URI = 'http://localhost:3000/callback';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly fileService: FileService,
    private readonly linearService: LinearService,
    private readonly configService: ConfigService,
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

  // Handle GET /callback
  @Get('/callback')
  async getCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    // Exchange code for access token
    const response = await fetch('https://api.linear.app/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.configService.get<string>('LINEAR_CLIENT_ID') ?? '',
        client_secret:
          this.configService.get<string>('LINEAR_CLIENT_SECRET') ?? '',
        redirect_uri: REDIRECT_URI,
        code: code,
      }),
    });

    const { access_token } = (await response.json()) as {
      access_token: string;
    };

    // TODO: Store the token (in database, session, etc.)
    // For now, redirect back to your frontend
    this.linearService.setAccessToken(access_token);

    if (access_token !== undefined) {
      return res.redirect(`http://localhost:5173?connected=true`);
    } else {
      return res.redirect(`http://localhost:5173?connected=false`);
    }
  }

  @Get('/status')
  getStatus() {
    return { connected: this.linearService.isConnected() };
  }
}
