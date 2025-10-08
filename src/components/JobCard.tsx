import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Job } from '@/lib/types';
import { MapPin, Building, ArrowRight, CalendarDays, Clock, Globe } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';

type JobCardProps = {
  job: Job;
};

function PostedDate({ date }: { date: string }) {
  const [posted, setPosted] = useState('');

  useEffect(() => {
    setPosted(formatDistanceToNow(new Date(date), { addSuffix: true }));
  }, [date]);

  if (!posted) {
    return null;
  }

  return <span className="truncate">{posted}</span>;
}


export function JobCard({ job }: JobCardProps) {

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-lg border p-1 bg-white">
            <Image
              src={job.companyLogo.imageUrl}
              alt={`${job.company} logo`}
              width={56}
              height={56}
              className="object-contain w-full h-full"
              data-ai-hint={job.companyLogo.imageHint}
            />
          </div>
          <div className="flex-grow">
            <CardTitle className="text-lg font-headline leading-tight mb-1">
                <Link href={`/jobs/${job.id}`} className="hover:text-primary/80 transition-colors">{job.title}</Link>
            </CardTitle>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>{job.company}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3 text-sm text-foreground/80 mb-4">
          {job.description}
        </CardDescription>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{job.category}</Badge>
          <Badge variant="outline">{job.jobType}</Badge>
          <Badge variant="outline">{job.workModel}</Badge>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-4 items-center text-sm text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center gap-2 truncate">
            <CalendarDays className="h-4 w-4 flex-shrink-0" />
            <PostedDate date={job.postedDate} />
        </div>
        <div className="col-span-2">
         <Link
          href={`/jobs/${job.id}`}
          className="flex items-center justify-center w-full gap-1 text-primary font-semibold hover:text-accent transition-colors"
        >
          View Job
          <ArrowRight className="h-4 w-4" />
        </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
