import { Injectable } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private readonly ai: GoogleGenAI;
  private readonly basePrompt: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set!');
    }
    this.ai = new GoogleGenAI({ apiKey });

    this.basePrompt = `
        Given a meeting summary extract all the tasks according to the response schema specified:
    
        `;
  }

  async generateItems<T>(
    content: string | undefined,
    schema: ZodSchema<T>,
    customPrompt?: string,
  ): Promise<T> {
    const prompt = customPrompt ?? this.basePrompt;
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt + content,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: schema.toJSONSchema(),
      },
    });

    return schema.parse(JSON.parse(response.text ?? '{}'));
  }
}
