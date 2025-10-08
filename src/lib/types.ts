import type { ImagePlaceholder } from './placeholder-images';

export type JobCategory = 'Frontend' | 'Backend' | 'Full Stack' | 'Mobile' | 'DevOps' | 'Data Science';
export type JobType = 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
export type WorkModel = 'Remote' | 'On-site' | 'Hybrid';
export type JobLocation = 'Nairobi, Kenya' | 'Remote (Kenya)' | 'Remote';


export type Job = {
  id: string;
  title: string;
  company: string;
  location: JobLocation;
  description: string;
  postedDate: string; // ISO 8601 format
  category: JobCategory;
  applyUrl: string;
  companyLogo: ImagePlaceholder;
  jobType: JobType;
  workModel: WorkModel;
};
