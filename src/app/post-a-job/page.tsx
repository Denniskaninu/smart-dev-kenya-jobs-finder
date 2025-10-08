import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/Footer';

export default function PostAJobPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-headline text-4xl font-bold text-primary mb-2">Reach Top Tech Talent in Kenya</h1>
            <p className="text-lg text-muted-foreground mb-10">Post your job on KenyaDevJobs and connect with thousands of qualified developers.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="text-left">
                    <CardHeader>
                        <CardTitle className="font-headline">Standard Listing</CardTitle>
                        <CardDescription>Free</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />Listed for 30 days</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />Appears in search results</li>
                        </ul>
                         <Button variant="outline" className="w-full" disabled>Coming Soon</Button>
                    </CardContent>
                </Card>
                 <Card className="border-primary border-2 text-left relative overflow-hidden">
                    <div className="bg-primary text-primary-foreground py-1 px-4 text-xs font-bold uppercase absolute top-4 -right-10 transform rotate-45">Popular</div>
                    <CardHeader>
                        <CardTitle className="font-headline">Featured Listing</CardTitle>
                        <CardDescription className="text-xl font-bold text-primary">$99 / post</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />All features of Standard, plus:</li>
                            <li className="flex items-center gap-2 font-semibold"><Check className="h-4 w-4 text-primary" />Highlighted in search results</li>
                            <li className="flex items-center gap-2 font-semibold"><Check className="h-4 w-4 text-primary" />Featured on homepage for 7 days</li>
                             <li className="flex items-center gap-2 font-semibold"><Check className="h-4 w-4 text-primary" />Emailed to subscribers</li>
                        </ul>
                        <Button className="w-full" disabled>Start Posting</Button>
                    </CardContent>
                </Card>
            </div>
             <div className="mt-8 text-sm text-muted-foreground">
                <p>For custom packages or questions, please <Link href="#" className="text-primary underline">contact us</Link>.</p>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
