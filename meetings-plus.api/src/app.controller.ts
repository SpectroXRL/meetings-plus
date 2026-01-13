/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
//import { zodToJsonSchema } from 'zod-to-json-schema';

const issueSchema = z.object({
  title: z.string().describe('Title of the task/issue'),
  description: z
    .string()
    .describe('A short description giving details supporting the issue title'),
});

const issuesSchema = z.object({
  issues: z.array(issueSchema),
});

@Controller()
export class AppController {
  private readonly ai: GoogleGenAI;
  private readonly prompt: string;

  constructor(private readonly appService: AppService) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set!');
    }
    this.ai = new GoogleGenAI({ apiKey });

    this.prompt = `
    Given a meeting summary extract all the issue titles and descriptions from it:

    `;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/ai')
  async getAiResponse(): Promise<string | undefined> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Explain how AI works in a few words',
    });

    return response ? response.text : "Didn't work";
  }

  @Post('/transcript')
  @UseInterceptors(FileInterceptor('transcript'))
  async postTranscript(
    @UploadedFile()
    file?: Express.Multer.File,
  ): Promise<void> {
    console.log(file);
    const content = (file as { buffer: Buffer } | undefined)?.buffer.toString(
      'utf-8',
    );

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: this.prompt + content,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: issuesSchema.toJSONSchema(),
      },
    });

    const issues = issuesSchema.parse(JSON.parse(response.text ?? '{}'));
    console.log(issues);
  }
}
