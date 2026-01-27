import { Injectable } from '@nestjs/common';
import { LinearClient } from '@linear/sdk';
import { AiService } from 'src/ai/ai.service';
import { getLinearSchemas, LinearIssues } from './linear-schema.interface';

@Injectable()
export class LinearService {
  private linearClient: LinearClient;
  private accessToken: string | null = null;

  constructor(private readonly aiService: AiService) {
    this.linearClient = new LinearClient({
      apiKey: process.env.LINEAR_API_KEY,
    });
  }

  setAccessToken(token: string): void {
    this.accessToken = token;

    this.linearClient = new LinearClient({
      accessToken: token,
    });
  }

  getAccessToken(): string {
    return this.accessToken ?? '';
  }

  isConnected(): boolean {
    return this.accessToken !== null;
  }

  async extractIssues(content: string | undefined): Promise<LinearIssues> {
    const { linearIssuesSchema } = await getLinearSchemas();
    return await this.aiService.generateItems(content, linearIssuesSchema);
  }

  async createIssues(content: string | undefined): Promise<void> {
    const teams = await this.linearClient.teams();
    const team = teams.nodes[0];

    const extractedData = await this.extractIssues(content);

    if (team.id) {
      const issuesWithTeam = extractedData.issues.map((issue) => ({
        ...issue,
        teamId: team.id,
      }));
      await this.linearClient.createIssueBatch({
        issues: issuesWithTeam,
      });
      console.log('issue created');
    }
  }
}
