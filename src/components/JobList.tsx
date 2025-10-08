"use client";

import type { Job, JobCategory } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobCard } from './JobCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ALL_CATEGORIES: JobCategory[] = ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'DevOps', 'Data Science'];

type JobListProps = {
  jobs: Job[];
};

export function JobList({ jobs }: JobListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'
  const [selectedCategories, setSelectedCategories] = useState<Set<JobCategory>>(new Set());

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        result = result.filter(job => 
            job.title.toLowerCase().includes(lowercasedQuery) ||
            job.company.toLowerCase().includes(lowercasedQuery) ||
            job.description.toLowerCase().includes(lowercasedQuery)
        );
    }

    if (selectedCategories.size > 0) {
        result = result.filter(job => selectedCategories.has(job.category));
    }

    result.sort((a, b) => {
        const dateA = new Date(a.postedDate).getTime();
        const dateB = new Date(b.postedDate).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [jobs, searchQuery, sortOrder, selectedCategories]);

  const toggleCategory = (category: JobCategory) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories(new Set());
    setSortOrder('newest');
  }

  const hasActiveFilters = searchQuery || selectedCategories.size > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h2 className="font-headline text-4xl font-bold text-primary mb-2">Find Your Dream Tech Job</h2>
        <p className="text-lg text-muted-foreground">The latest and most legitimate developer jobs in Kenya, all in one place.</p>
      </div>

      <div className="bg-card p-4 rounded-lg shadow-sm border mb-8 sticky top-[61px] z-30">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, company, or keyword..."
              className="pl-10 h-11 text-base"
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
                  onCheckedChange={() => toggleCategory(category)}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
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
