import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Job } from '@/lib/types';
import { MapPin, Building, Calendar, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type JobCardProps = {
  job: Job;
};

export function JobCard({ job }: JobCardProps) {
  const postedAt = formatDistanceToNow(new Date(job.postedDate), { addSuffix: true });

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
            <CardTitle className="text-lg font-headline leading-tight mb-1">{job.title}</CardTitle>
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
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
        </div>
         <Link
          href={`/jobs/${job.id}`}
          className="flex items-center gap-1 text-primary font-semibold hover:text-accent transition-colors"
        >
          View Job
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
