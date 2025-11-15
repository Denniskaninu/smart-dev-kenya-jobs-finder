import type { ImagePlaceholder } from './placeholder-images';

export type JobCategory = 'Frontend' | 'Backend' | 'Full Stack' | 'Mobile' | 'DevOps' | 'Data Science';

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  postedDate: string; // ISO 8601 format
  category: JobCategory;
  applyUrl: string;
  companyLogo: ImagePlaceholder;
};
