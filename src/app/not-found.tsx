"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-4 py-20 bg-background min-h-screen">
      {/* Background blurs - Premium Glowing Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[180px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        {/* Large stylized 404 */}
        <div className="relative mb-8">
           <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110 animate-pulse" />
           <h1 className="font-display text-[150px] sm:text-[200px] lg:text-[250px] font-black leading-none tracking-tighter text-foreground/5 relative select-none">
             404
             <span className="absolute inset-0 flex items-center justify-center text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-foreground bg-clip-text">
               Lost in Space
             </span>
           </h1>
        </div>

        <p className="text-xl md:text-2xl text-muted-foreground mt-4 mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
          The page you're looking for has drifted away into the void. <br className="hidden sm:block" />
          Don't worry, we'll help you find your way back.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/">
            <Button size="lg" className="rounded-full px-10 py-7 text-lg font-bold shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all duration-300 gap-2">
              <Home className="w-5 h-5" />
              Back to Safety
            </Button>
          </Link>
          <Link href="/jobs">
            <Button size="lg" variant="outline" className="rounded-full px-10 py-7 text-lg font-bold border-border bg-card/50 backdrop-blur-sm hover:bg-card hover:-translate-y-1 transition-all duration-300 gap-2">
              <Search className="w-5 h-5" />
              Explore Jobs
            </Button>
          </Link>
        </div>

        {/* Back Link */}
        <button 
          onClick={() => window.history.back()}
          className="mt-16 text-sm font-bold text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Go back to previous page
        </button>
      </div>

      {/* Decorative stars/dots */}
      <div className="absolute top-1/4 left-1/10 w-1.5 h-1.5 bg-primary/30 rounded-full animate-ping" />
      <div className="absolute bottom-1/4 right-1/10 w-2 h-2 bg-accent/20 rounded-full animate-pulse" />
      <div className="absolute top-1/2 left-1/5 w-1 h-1 bg-white/10 rounded-full" />
      <div className="absolute bottom-1/2 right-1/5 w-1 h-1 bg-white/10 rounded-full" />
    </div>
  );
}
