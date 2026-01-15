import { LinearClient } from '@linear/sdk';
import z from 'zod';

async function pullStates(): Promise<string> {
  const linearClient = new LinearClient({
    apiKey: process.env.LINEAR_API_KEY,
  });

  const states = (await linearClient.workflowStates()).nodes.map((state) => ({
    id: state.id,
    name: state.name,
    type: state.type,
  }));

  return JSON.stringify(states);
}

export function createLinearIssueSchema(statesInfo: string) {
  return z.object({
    title: z.string().describe('Title of the task/issue'),
    description: z
      .string()
      .describe(
        'A short description giving details supporting the issue title',
      ),
    stateId: z
      .string()
      .describe(
        'The state id representing the current workflow state this item is in, use the ids given: ' +
          statesInfo,
      ),
  });
}

export async function getLinearSchemas() {
  const statesInfo = await pullStates();
  const linearIssueSchema = createLinearIssueSchema(statesInfo);
  const linearIssuesSchema = z.object({
    issues: z.array(linearIssueSchema),
  });
  return { linearIssueSchema, linearIssuesSchema };
}

export type LinearIssue = z.infer<ReturnType<typeof createLinearIssueSchema>>;
export type LinearIssues = { issues: LinearIssue[] };
