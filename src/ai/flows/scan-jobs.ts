'use server';

/**
 * @fileOverview A flow to find tech jobs from a list of specified companies.
 *
 * - scanJobsByCompany - A function that finds jobs.
 * - ScanJobsByCompanyInput - The input type for the scanJobsByCompany function.
 * - ScanJobsByCompanyOutput - The return type for the scanJobsByCompany function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { jobs } from '@/lib/jobs';
import type { Job } from '@/lib/types';

const FAMOUS_COMPANIES = [
  'Safaricom PLC',
  "Africa's Talking",
  'Cellulant',
  'M-KOPA Solar',
  'Twiga Foods',
  'Lori Systems',
  'Equity Bank',
  'Sendy',
  'iHub',
];

const ScanJobsByCompanyInputSchema = z.object({
  companies: z.array(z.string()).describe('A list of company names to search for jobs in.'),
});

export type ScanJobsByCompanyInput = z.infer<typeof ScanJobsByCompanyInputSchema>;

const FoundJobSchema = z.object({
  company: z.string(),
  title: z.string(),
  jobId: z.string(),
});

const ScanJobsByCompanyOutputSchema = z.object({
  foundJobs: z.array(FoundJobSchema).describe('A list of jobs found for the specified companies.'),
});

export type ScanJobsByCompanyOutput = z.infer<typeof ScanJobsByCompanyOutputSchema>;

async function findJobs(companies: string[]): Promise<Job[]> {
    const lowercasedCompanies = companies.map(c => c.toLowerCase());
    return jobs.filter(job => lowercasedCompanies.includes(job.company.toLowerCase()));
}

const findJobsTool = ai.defineTool(
    {
        name: 'findJobsTool',
        description: 'Finds jobs from a given list of companies within the database.',
        inputSchema: z.object({ companies: z.array(z.string()) }),
        outputSchema: z.array(z.object({
            id: z.string(),
            title: z.string(),
            company: z.string(),
        })),
    },
    async ({ companies }) => {
        const found = await findJobs(companies);
        return found.map(({ id, title, company }) => ({ id, title, company }));
    }
);


export async function scanJobsByCompany(input: ScanJobsByCompanyInput): Promise<ScanJobsByCompanyOutput> {
  return scanJobsByCompanyFlow(input);
}

const scanJobsPrompt = ai.definePrompt({
  name: 'scanJobsPrompt',
  input: { schema: ScanJobsByCompanyInputSchema },
  output: { schema: ScanJobsByCompanyOutputSchema },
  tools: [findJobsTool],
  prompt: `You are a job scanning assistant for a Kenyan tech job board. The user wants to find jobs from the following companies: {{{json companies}}}.
  
  Use the findJobsTool to search for jobs from these companies.
  
  Format the output to be a list of found jobs, with each job having the company name, job title, and jobId.
  
  If no jobs are found for a company, do not include it in your response.`,
});

const scanJobsByCompanyFlow = ai.defineFlow(
  {
    name: 'scanJobsByCompanyFlow',
    inputSchema: ScanJobsByCompanyInputSchema,
    outputSchema: ScanJobsByCompanyOutputSchema,
  },
  async (input) => {
     const llmResponse = await scanJobsPrompt(input);
     const toolResponse = llmResponse.toolRequest?.tool?.findJobsTool;

    if (toolResponse) {
       const jobsFound = await findJobsTool(toolResponse);
       const finalResponse = await llmResponse.continue(jobsFound);
       return finalResponse.output!;
    }
    
    // Fallback if the tool isn't called for some reason
    const foundJobs = await findJobs(input.companies);
    return {
        foundJobs: foundJobs.map(j => ({ company: j.company, title: j.title, jobId: j.id }))
    };
  }
);
