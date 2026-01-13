import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';

const issueSchema = z.object({
  title: z.string().describe('Title of the task/issue'),
  description: z
    .string()
    .describe('A short description giving details supporting the issue title'),
});

const issuesSchema = z.object({
  issues: z.array(issueSchema),
});

type Issues = z.infer<typeof issuesSchema>;

@Injectable()
export class AiService {
  private readonly ai: GoogleGenAI;
  private readonly prompt: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set!');
    }
    this.ai = new GoogleGenAI({ apiKey });

    this.prompt = `
        Given a meeting summary extract all the issue titles and descriptions from it:
    
        `;
  }

  async generateIssues(content: string | undefined): Promise<Issues> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: this.prompt + content,
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: issuesSchema.toJSONSchema(),
      },
    });

    return issuesSchema.parse(JSON.parse(response.text ?? '{}'));
  }
}
