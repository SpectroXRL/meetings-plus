import { Injectable } from '@nestjs/common';
import { LinearClient } from '@linear/sdk';
import { AiService } from 'src/ai/ai.service';
import { linearIssuesSchema, LinearIssues } from './linear-schema.interface';

@Injectable()
export class LinearService {
  private readonly linearClient: LinearClient;

  constructor(private readonly aiService: AiService) {
    this.linearClient = new LinearClient({
      apiKey: process.env.LINEAR_API_KEY,
    });
  }

  async extractIssues(content: string | undefined): Promise<LinearIssues> {
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
