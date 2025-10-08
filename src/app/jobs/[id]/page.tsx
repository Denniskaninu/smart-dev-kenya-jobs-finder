'use client';

import { useState } from 'react';
import { jobs } from '@/lib/jobs';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Briefcase, Calendar, ExternalLink, Building, Loader2, Clock, Globe } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { format, formatDistanceToNow } from 'date-fns';
import type { Job } from '@/lib/types';
import { filterFakeJobs } from '@/ai/flows/filter-fake-jobs';
import { useToast } from "@/hooks/use-toast";
import { Footer } from '@/components/Footer';

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
      toast({
        title: "Could not verify job",
        description: "We couldn't verify this job's legitimacy. Please proceed with caution.",
      });
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
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
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
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge variant="secondary">{job.category}</Badge>
                            <Badge variant="outline">{job.jobType}</Badge>
                            <Badge variant="outline">{job.workModel}</Badge>
                        </div>
                        </div>
                         <div className="flex-shrink-0 pt-2">
                            <Button onClick={handleApplyClick} size="lg" disabled={isChecking} className="w-full sm:w-auto">
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
                    </div>
                </div>
            </div>
            
            <div className="mt-8">
                 <Card>
                    <CardContent className="p-6 space-y-8">
                    <div>
                        <h2 className="font-headline text-xl font-bold mb-3">Job Description</h2>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 whitespace-pre-line">
                        {job.description}
                        </div>
                    </div>
                    <div>
                        <h2 className="font-headline text-xl font-bold mb-4">Job Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                            <Clock className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-bold text-base">Job Type</p>
                                <p className="text-muted-foreground">{job.jobType}</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                            <Globe className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-bold text-base">Work Model</p>
                                <p className="text-muted-foreground">{job.workModel}</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                            <Calendar className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-bold text-base">Date Posted</p>
                                <p className="text-muted-foreground">{format(new Date(job.postedDate), 'MMMM d, yyyy')} ({formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })})</p>
                            </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                            <Briefcase className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-bold text-base">Category</p>
                                <p className="text-muted-foreground">{job.category}</p>
                            </div>
                            </div>
                        </div>
                      </div>
                    </CardContent>
                 </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
