import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="bg-card text-card-foreground shadow-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-primary transition-opacity hover:opacity-80">
          <Briefcase className="h-7 w-7 text-accent" />
          <h1 className="text-2xl font-headline font-bold tracking-tight">
            KenyaDevJobs
          </h1>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
