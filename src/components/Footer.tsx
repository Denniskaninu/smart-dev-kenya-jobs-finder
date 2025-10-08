import Link from 'next/link';
import { Briefcase, Twitter, Linkedin, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
             <Link href="/" className="flex items-center gap-3 text-primary transition-opacity hover:opacity-80 mb-4">
                <Briefcase className="h-7 w-7 text-accent" />
                <h1 className="text-2xl font-headline font-bold tracking-tight">
                    KenyaDevJobs
                </h1>
            </Link>
            <p className="text-sm text-muted-foreground">The best place for Kenyan developers to find legit tech jobs. We scrape and verify job listings so you don't have to.</p>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Site Map</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/post-a-job" className="text-muted-foreground hover:text-primary transition-colors">Post a Job</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
             <h3 className="font-headline font-semibold mb-4">Resources</h3>
             <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Salary Guide</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
             </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold mb-4">Connect</h3>
            <div className="flex items-center space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-6 w-6" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-6 w-6" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-6 w-6" /></Link>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} KenyaDevJobs. All rights reserved. Made with ❤️ in Kenya.</p>
        </div>
      </div>
    </footer>
  );
}
