import { Header } from '@/components/Header';
import { JobList } from '@/components/JobList';
import { jobs } from '@/lib/jobs';
import type { Job } from '@/lib/types';
import { Suspense } from 'react';
import { JobSkeleton } from '@/components/JobSkeleton';

async function JobBoard() {
  // We will display all jobs and let the user filter them.
  // The AI verification will happen on the details page.
  const legitJobs: Job[] = jobs;

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
