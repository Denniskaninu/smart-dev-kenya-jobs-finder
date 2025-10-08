'use client';

import { useState } from 'react';
import { jobs } from '@/lib/jobs';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Briefcase, Calendar, ExternalLink, Building, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { format, formatDistanceToNow } from 'date-fns';
import type { Job } from '@/lib/types';
import { filterFakeJobs } from '@/ai/flows/filter-fake-jobs';
import { useToast } from "@/hooks/use-toast";

export default function JobDetailsPage() {
  const params = useParams();
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();
  const job = jobs.find((j) => j.id === params.id) as Job | undefined;

  if (!job) {
    notFound();
  }
  
  const handleApplyClick = async () => {
    setIsChecking(true);
    try {
      const result = await filterFakeJobs({
        jobTitle: job.title,
        company: job.company,
        description: job.description,
        location: job.location,
      });

      if (result.isLegitimate) {
        window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
      } else {
        toast({
          variant: "destructive",
          title: "Potentially Fake Job",
          description: result.reason || "This job has been flagged as suspicious and we advise against applying.",
        });
      }
    } catch (error) {
      console.error("Error verifying job:", error);
      // If the check fails, let the user proceed but show a warning.
      toast({
        title: "Could not verify job",
        description: "We couldn't verify this job's legitimacy. Please proceed with caution.",
      });
      // Allow applying even if verification fails
      window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsChecking(false);
    }
  };


  const heroImage = PlaceHolderImages.find(img => img.id === 'job-detail-hero');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="relative h-48 md:h-64 w-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              data-ai-hint={heroImage.imageHint}
              fill
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container mx-auto px-4 -mt-24 pb-12">
          <Card className="w-full max-w-4xl mx-auto overflow-hidden">
            <CardHeader className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
                <div className="flex-shrink-0 w-24 h-24 rounded-lg border p-1 bg-white mb-4 sm:mb-0">
                  <Image
                    src={job.companyLogo.imageUrl}
                    alt={`${job.company} logo`}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                    data-ai-hint={job.companyLogo.imageHint}
                  />
                </div>
                <div className="flex-grow">
                  <h1 className="font-headline text-3xl font-bold text-primary">{job.title}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground mt-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                     <Badge variant="secondary">{job.category}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div>
                <h2 className="font-headline text-xl font-bold mb-3">Job Description</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 whitespace-pre-line">
                  {job.description}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Calendar className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-bold">Date Posted</p>
                    <p>{format(new Date(job.postedDate), 'MMMM d, yyyy')} ({formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })})</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Briefcase className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-bold">Job Type</p>
                    <p>{job.category}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center pt-4">
                 <Button onClick={handleApplyClick} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isChecking}>
                    {isChecking ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                        </>
                    ) : (
                        <>
                        Apply Now
                        <ExternalLink className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
