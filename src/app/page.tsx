import { Header } from '@/components/Header';
import { JobList } from '@/components/JobList';
import { jobs } from '@/lib/jobs';

export default function Home() {
  const legitJobs = jobs.filter(job => job.id !== 'job-9');
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 w-full">
        <JobList jobs={legitJobs} />
      </main>
    </div>
  );
}
