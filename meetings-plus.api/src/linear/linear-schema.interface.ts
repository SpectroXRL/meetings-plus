/* eslint-disable @typescript-eslint/no-unused-vars */
import z from 'zod';

export const linearIssueSchema = z.object({
  title: z.string().describe('Title of the task/issue'),
  description: z
    .string()
    .describe('A short description giving details supporting the issue title'),
});

export const linearIssuesSchema = z.object({
  issues: z.array(linearIssueSchema),
});

export type LinearIssues = z.infer<typeof linearIssuesSchema>;
export type LinearIssue = z.infer<typeof linearIssueSchema>;
