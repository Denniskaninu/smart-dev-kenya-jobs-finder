import { Header } from '@/components/Header';
import { JobList } from '@/components/JobList';
import { jobs } from '@/lib/jobs';
import { filterFakeJobs } from '@/ai/flows/filter-fake-jobs';
import { Job } from '@/lib/types';
import { Suspense } from 'react';
import { JobSkeleton } from '@/components/JobSkeleton';

async function JobBoard() {
  // We are creating an array of promises, where each promise is a job check.
  const jobVerificationPromises = jobs.map(async (job) => {
    try {
      const result = await filterFakeJobs({
        jobTitle: job.title,
        company: job.company,
        description: job.description,
        location: job.location,
      });
      return result.isLegitimate ? job : null;
    } catch (error) {
      console.error(`Error verifying job ${job.id}:`, error);
      // In case of an API error, we can choose to either show the job or hide it.
      // For a better user experience, we will show it, as the issue is likely temporary.
      return job;
    }
  });

  // We wait for all the job checks to complete.
  const verifiedJobsResults = await Promise.all(jobVerificationPromises);

  // We filter out the null values, which are the jobs that were found to be illegitimate.
  const legitJobs = verifiedJobsResults.filter((job): job is Job => job !== null);

  return <JobList jobs={legitJobs} />;
}


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 w-full">
         <Suspense fallback={<JobSkeleton />}>
           <JobBoard />
         </Suspense>
      </main>
    </div>
  );
}
