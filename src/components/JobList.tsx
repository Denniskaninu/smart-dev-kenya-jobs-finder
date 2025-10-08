"use client";

import type { Job, JobCategory, JobType, WorkModel, JobLocation } from '@/lib/types';
import { useState, useMemo, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobCard } from './JobCard';
import { Search, SlidersHorizontal, X, Loader2, ScanSearch } from 'lucide-react';
import { subDays, isAfter } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { scanJobsByCompany, type ScanJobsByCompanyOutput } from '@/ai/flows/scan-jobs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';

const ALL_CATEGORIES: JobCategory[] = ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'DevOps', 'Data Science'];
const ALL_JOB_TYPES: JobType[] = ['Full-time', 'Part-time', 'Internship', 'Contract'];
const ALL_WORK_MODELS: WorkModel[] = ['Remote', 'On-site', 'Hybrid'];
const ALL_LOCATIONS: JobLocation[] = ['Nairobi, Kenya', 'Remote (Kenya)', 'Remote'];

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
  'Government of Kenya'
];


type JobListProps = {
  jobs: Job[];
};

export function JobList({ jobs }: JobListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<Set<JobCategory>>(new Set());
  const [selectedJobTypes, setSelectedJobTypes] = useState<Set<JobType>>(new Set());
  const [selectedWorkModels, setSelectedWorkModels] = useState<Set<WorkModel>>(new Set());
  const [selectedLocations, setSelectedLocations] = useState<Set<JobLocation>>(new Set());
  const [isScanning, startScanning] = useTransition();
  const [scanResult, setScanResult] = useState<ScanJobsByCompanyOutput | null>(null);
  const [showScanResult, setShowScanResult] = useState(false);


  const handleScan = () => {
    startScanning(async () => {
      const result = await scanJobsByCompany({ companies: FAMOUS_COMPANIES });
      setScanResult(result);
      setShowScanResult(true);
    });
  };

  const filteredJobs = useMemo(() => {
    let result = jobs.filter(job => isAfter(new Date(job.postedDate), subDays(new Date(), 30)));

    // Date filter
    if (dateFilter !== 'all') {
        const dateLimit = subDays(new Date(), dateFilter === 'week' ? 7 : 30);
        result = result.filter(job => isAfter(new Date(job.postedDate), dateLimit));
    }

    // Search query filter
    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        result = result.filter(job => 
            job.title.toLowerCase().includes(lowercasedQuery) ||
            job.company.toLowerCase().includes(lowercasedQuery) ||
            job.description.toLowerCase().includes(lowercasedQuery)
        );
    }
    
    // Category filter
    if (selectedCategories.size > 0) {
        result = result.filter(job => selectedCategories.has(job.category));
    }
    
    // Job Type filter
    if (selectedJobTypes.size > 0) {
        result = result.filter(job => selectedJobTypes.has(job.jobType));
    }

    // Work Model filter
    if (selectedWorkModels.size > 0) {
        result = result.filter(job => selectedWorkModels.has(job.workModel));
    }
    
    // Location filter
    if (selectedLocations.size > 0) {
        result = result.filter(job => selectedLocations.has(job.location));
    }


    // Default sort by newest
    result.sort((a, b) => {
        const dateA = new Date(a.postedDate).getTime();
        const dateB = new Date(b.postedDate).getTime();
        return dateB - dateA;
    });

    return result;
  }, [jobs, searchQuery, dateFilter, selectedCategories, selectedJobTypes, selectedWorkModels, selectedLocations]);

  const toggleFilter = <T,>(set: Set<T>, item: T) => {
    const newSet = new Set(set);
    if (newSet.has(item)) {
      newSet.delete(item);
    } else {
      newSet.add(item);
    }
    return newSet;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories(new Set());
    setSelectedJobTypes(new Set());
    setSelectedWorkModels(new Set());
    setSelectedLocations(new Set());
    setDateFilter('all');
  }

  const hasActiveFilters = searchQuery || selectedCategories.size > 0 || selectedJobTypes.size > 0 || selectedWorkModels.size > 0 || selectedLocations.size > 0 || dateFilter !== 'all';
  
  if (showScanResult && scanResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
          </CardHeader>
          <CardContent>
            {scanResult.foundJobs.length > 0 ? (
              <ul className="space-y-2">
                {scanResult.foundJobs.map(job => (
                  <li key={job.jobId} className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                    <div>
                      <Link href={`/jobs/${job.jobId}`} className="font-semibold text-primary hover:underline">{job.title}</Link>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <Button asChild variant="secondary" size="sm">
                       <Link href={`/jobs/${job.jobId}`}>View</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No jobs found at the famous tech companies right now.</p>
            )}
            <Button onClick={() => setShowScanResult(false)} className="mt-4">Back to all jobs</Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h2 className="font-headline text-4xl font-bold text-primary mb-2">Find Your Dream Tech Job</h2>
        <p className="text-lg text-muted-foreground">The latest and most legitimate developer jobs in Kenya, all in one place.</p>
      </div>

      <div className="bg-card p-4 rounded-lg shadow-sm border mb-8 sticky top-[61px] z-30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          <div className="relative xl:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, company, or keyword..."
              className="pl-10 h-11 text-base w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 w-full justify-between">
                <span>Categories {selectedCategories.size > 0 && `(${selectedCategories.size})`}</span>
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ALL_CATEGORIES.map(category => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.has(category)}
                  onCheckedChange={() => setSelectedCategories(toggleFilter(selectedCategories, category))}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 w-full justify-between">
                <span>Job Type {selectedJobTypes.size > 0 && `(${selectedJobTypes.size})`}</span>
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Job Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ALL_JOB_TYPES.map(type => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedJobTypes.has(type)}
                  onCheckedChange={() => setSelectedJobTypes(toggleFilter(selectedJobTypes, type))}
                >
                  {type}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 w-full justify-between">
                <span>Work Model {selectedWorkModels.size > 0 && `(${selectedWorkModels.size})`}</span>
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Work Model</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ALL_WORK_MODELS.map(model => (
                <DropdownMenuCheckboxItem
                  key={model}
                  checked={selectedWorkModels.has(model)}
                  onCheckedChange={() => setSelectedWorkModels(toggleFilter(selectedWorkModels, model))}
                >
                  {model}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-2">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Date Posted" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 w-full justify-between">
                  <span>Location {selectedLocations.size > 0 && `(${selectedLocations.size})`}</span>
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Location</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ALL_LOCATIONS.map(location => (
                  <DropdownMenuCheckboxItem
                    key={location}
                    checked={selectedLocations.has(location)}
                    onCheckedChange={() => setSelectedLocations(toggleFilter(selectedLocations, location))}
                  >
                    {location}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button onClick={handleScan} className="h-11 xl:col-start-5" disabled={isScanning}>
              {isScanning ? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                  </>
              ) : (
                  <>
                  <ScanSearch className="mr-2 h-4 w-4" />
                  Scan Top Companies
                  </>
              )}
          </Button>
        </div>


        {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{filteredJobs.length} results found.</p>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-accent hover:text-accent">
                    <X className="mr-1 h-4 w-4" />
                    Clear Filters
                </Button>
            </div>
        )}
      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-lg border">
          <h3 className="font-headline text-2xl font-bold">No Jobs Found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
