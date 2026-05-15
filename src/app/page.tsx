import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import JobCard from "@/components/JobCard";
import { ArrowRight, Briefcase, Users, Star, Zap, Search } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import { auth } from "@/auth";

const STATS = [
  { icon: Briefcase, label: "Active Jobs", value: "12+" },
  { icon: Users, label: "Companies Hiring", value: "3" },
  { icon: Star, label: "Featured Roles", value: "4" },
  { icon: Zap, label: "AI Match Score", value: "Live" },
];

export default async function HomePage() {
  const session = await auth();
  const user = session?.user;

  // Fetch featured/recent jobs from database
  await connectDB();
  const recentJobsData = await Job.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean()
    .exec();

  // Serialize MongoDB ObjectId to string for Client Components
  const recentJobs = recentJobsData.map(job => ({
    ...job,
    _id: (job as any)._id.toString(),
    createdAt: (job as any).createdAt.toISOString(),
    updatedAt: (job as any).updatedAt.toISOString(),
  }));

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-20 pb-24 sm:pt-28 sm:pb-32 bg-background flex-1 flex flex-col justify-center">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center z-10">
          <Badge
            variant="outline"
            className="mb-6 px-3 py-1 text-xs border-primary/30 text-primary bg-primary/5 inline-flex items-center gap-1.5 rounded-full"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            AI-Powered Job Matching
          </Badge>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight mb-6">
            Find your next <span className="text-primary relative inline-block">dream role
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Hired. connects top talent with world-class companies. Get AI-powered match scores, track applications, and land the job you deserve
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/jobs" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 px-8 py-6 rounded-full text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                <Search className="w-5 h-5" />
                Explore Jobs
              </Button>
            </Link>
            {!user && (
              <Link href="/auth/signin" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto gap-2 px-8 py-6 rounded-full text-base shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign in to apply
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50 relative z-20">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center group">
              <Icon className="w-8 h-8 text-primary mb-2" />
              <span className="font-display text-3xl font-bold text-foreground">{value}</span>
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      {recentJobs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">Latest Opportunities</h2>
              <p className="text-muted-foreground mt-2">Discover roles tailored to your expertise and ambition.</p>
            </div>
            <Link href="/jobs">
              <Button variant="ghost" className="gap-2 hover:bg-primary/10 hover:text-primary transition-colors">
                See all <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentJobs.map((job) => (
              <JobCard key={job._id} job={job as any} user={user as any} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 p-12 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4 relative z-10">
            Ready to get hired?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto relative z-10">
            Create your profile, add your skills, and let our AI find the perfect match for you.
          </p>
          {user ? (
            <Link href="/jobs" className="relative z-10">
              <Button size="lg" className="rounded-full px-8 py-6 text-base">
                Explore all jobs <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <Link href="/auth/register" className="relative z-10">
               <Button size="lg" className="rounded-full px-8 py-6 text-base">
                 Get started — it's free <ArrowRight className="w-6 h-6 ml-2" />
               </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer simple */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-border mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="font-display text-xl font-bold text-foreground">Hired<span className="text-primary">.</span></span>
        <p className="text-sm text-muted-foreground">© 2024 Hired Inc. All rights reserved.</p>
        <div className="flex gap-8">
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Support</Link>
        </div>
      </footer>
    </div>
  );
}