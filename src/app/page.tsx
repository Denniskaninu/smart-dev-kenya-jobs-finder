import { Header } from '@/components/Header';
import { JobList } from '@/components/JobList';
import { jobs as allJobs } from '@/lib/jobs';
import type { Job } from '@/lib/types';
import { filterFakeJobs } from '@/ai/flows/filter-fake-jobs';
import { Suspense } from 'react';
import { JobSkeleton } from '@/components/JobSkeleton';

async function JobBoard() {
  const legitJobsPromises = allJobs.map(async (job) => {
    try {
      const legitimacy = await filterFakeJobs({
        jobTitle: job.title,
        company: job.company,
        description: job.description,
        location: job.location,
      });
      return { ...job, isLegitimate: legitimacy.isLegitimate };
    } catch (error) {
      console.error(`Error filtering job ${job.id}:`, error);
      // Default to legitimate in case of AI error to not hide a potentially good job
      return { ...job, isLegitimate: true };
    }
  });

  const jobsWithLegitimacy = await Promise.all(legitJobsPromises);
  const legitJobs = jobsWithLegitimacy.filter(job => job.isLegitimate).map(({ isLegitimate, ...job }) => job as Job);

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
