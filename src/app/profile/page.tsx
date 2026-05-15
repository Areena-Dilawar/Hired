"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User as UserIcon, 
  Mail, 
  Briefcase, 
  ShieldCheck, 
  Settings, 
  ExternalLink,
  Loader2,
  MapPin,
  Calendar,
  Building2,
  Code2
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#030303] min-h-[calc(100vh-64px)]">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <Loader2 className="w-10 h-10 animate-spin text-primary relative z-10" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as any;
  const isEmployer = user.role === "employer";

  return (
    <div className="min-h-screen bg-[#030303] text-white pb-16 relative overflow-hidden">
      {/* Signature Background Glows */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 pt-10 relative z-10">
        {/* Profile Hero Section - Scaled Down */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-transparent to-accent/5 rounded-[32px] blur-2xl opacity-40" />
          <div className="relative bg-white/[0.03] border border-white/10 backdrop-blur-3xl rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 overflow-hidden">
             {/* Hero Corner Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary via-accent to-primary rounded-full animate-spin duration-[12s] opacity-40 blur-sm" />
              <Avatar className="w-24 h-24 md:w-28 md:h-28 border-2 border-[#030303] relative z-10">
                <AvatarImage src={user.avatar || user.image} />
                <AvatarFallback className="bg-zinc-900 text-2xl font-black">{user.name?.[0]}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="space-y-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    {user.name}
                  </h1>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    isEmployer 
                    ? "bg-accent/10 text-accent border-accent/20" 
                    : "bg-primary/10 text-primary border-primary/20"
                  }`}>
                    <ShieldCheck className="w-3 h-3 mr-1.5" />
                    {user.role}
                  </span>
                </div>
                <p className="text-zinc-500 font-medium text-sm flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary/70" />
                  {user.email}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                <div className="flex items-center text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary/40" />
                  Remote / Global
                </div>
                <div className="flex items-center text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary/40" />
                  Joined May 2026
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-[140px]">
              <Link href={isEmployer ? "/dashboard" : "/jobs"}>
                <Button className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[9px] shadow-lg shadow-primary/20 active:scale-95 transition-all">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-10 rounded-xl border-white/5 bg-white/[0.05] text-white hover:bg-white/[0.1] font-black uppercase tracking-widest text-[9px] active:scale-95 transition-all">
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Content Grid - Tighter Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-[24px] bg-gradient-to-br from-primary/10 via-white/[0.02] to-transparent border border-white/10 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
              <CardHeader className="p-6 pb-3">
                <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-zinc-400 leading-relaxed text-base">
                  {isEmployer 
                    ? `Managing talent acquisition and building high-performance teams at ${user.company || 'our organization'}. Focused on finding the best creators to shape the future.`
                    : "Ambitious professional seeking the next great challenge. Passionate about innovation, collaboration, and building products that make a real impact on the world."
                  }
                </p>
                
                {isEmployer && user.company && (
                   <div className="mt-6 grid grid-cols-1 gap-3">
                     <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Current Company</p>
                          <p className="text-base font-bold text-white">{user.company}</p>
                        </div>
                     </div>
                   </div>
                )}
              </CardContent>
            </Card>

            {!isEmployer && (
              <Card className="rounded-[24px] bg-gradient-to-br from-primary/10 via-white/[0.02] to-transparent border border-white/10 shadow-2xl overflow-hidden relative">
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                      <Code2 className="w-4 h-4" />
                    </div>
                    Professional Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="flex flex-wrap gap-2">
                    {["Next.js", "TypeScript", "Tailwind CSS", "UI/UX Design", "System Architecture", "Team Leadership"].map((skill) => (
                      <span key={skill} className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-400 text-[11px] font-black uppercase tracking-widest hover:border-primary/50 transition-colors cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-6">
            <Card className="rounded-[24px] bg-[#080808]/50 border border-white/10 shadow-2xl overflow-hidden group/card relative">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
               <CardHeader className="p-6 pb-3 relative z-10">
                <CardTitle className="text-base font-display font-bold flex items-center gap-2">
                   Account Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4 relative z-10">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Account Status</p>
                  <div className="flex items-center text-[11px] font-black uppercase tracking-widest text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                    Verified
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Auth Provider</p>
                  <div className="flex items-center text-[11px] font-black uppercase tracking-widest text-white">
                    {user.provider || "Manual Login"}
                  </div>
                </div>
                <div className="pt-3 border-t border-white/10">
                   <p className="text-[10px] text-zinc-600 font-medium italic leading-relaxed">
                     Your profile is synchronized with our secure auth systems.
                   </p>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 rounded-[24px] bg-gradient-to-br from-primary/20 via-primary/5 to-primary/10 border border-primary/20 text-center space-y-3 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
               <h3 className="text-lg font-display font-black text-white relative z-10">Pro Features</h3>
               <p className="text-zinc-500 text-xs relative z-10 leading-relaxed">Unlock advanced hiring tools & insights.</p>
               <Button className="w-full h-9 rounded-full bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-[9px] relative z-10 shadow-lg active:scale-95 transition-all">
                 Explore Pro
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
