'use server';

/**
 * @fileOverview A flow to filter out fake or illegitimate job postings using an AI-powered legitimacy checker.
 *
 * - filterFakeJobs - A function that filters job postings.
 * - FilterFakeJobsInput - The input type for the filterFakeJobs function.
 * - FilterFakeJobsOutput - The return type for the filterFakeJobs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FilterFakeJobsInputSchema = z.object({
  jobTitle: z.string().describe('The title of the job posting.'),
  company: z.string().describe('The company offering the job.'),
  description: z.string().describe('The full description of the job posting.'),
  location: z.string().describe('The location of the job.'),
});

export type FilterFakeJobsInput = z.infer<typeof FilterFakeJobsInputSchema>;

const FilterFakeJobsOutputSchema = z.object({
  isLegitimate: z.boolean().describe('Whether the job posting is legitimate or not.'),
  reason: z.string().optional().describe('The reason why the job posting is considered fake, if applicable.'),
});

export type FilterFakeJobsOutput = z.infer<typeof FilterFakeJobsOutputSchema>;

export async function filterFakeJobs(input: FilterFakeJobsInput): Promise<FilterFakeJobsOutput> {
  return filterFakeJobsFlow(input);
}

const filterFakeJobsPrompt = ai.definePrompt({
  name: 'filterFakeJobsPrompt',
  input: {schema: FilterFakeJobsInputSchema},
  output: {schema: FilterFakeJobsOutputSchema},
  prompt: `You are an AI job posting legitimacy checker. Your job is to determine if a job posting is legitimate or fake based on the information provided.

Consider factors such as overly generic descriptions, unrealistic salary promises, lack of company information, poor grammar, and requests for personal financial information.

Job Title: {{{jobTitle}}}
Company: {{{company}}}
Description: {{{description}}}
Location: {{{location}}}

Based on the information above, determine if the job posting is legitimate. If it is not, explain why in the 'reason' field. Be concise.

Return a boolean value for isLegitimate. If you are unsure, default to true.`,
});

const filterFakeJobsFlow = ai.defineFlow(
  {
    name: 'filterFakeJobsFlow',
    inputSchema: FilterFakeJobsInputSchema,
    outputSchema: FilterFakeJobsOutputSchema,
  },
  async input => {
    const {output} = await filterFakeJobsPrompt(input);
    return output!;
  }
);
