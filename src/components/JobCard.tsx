"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck, Zap } from "lucide-react";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  description: string;
  salary?: string;
  skills: string[];
  applicationCount: number;
  createdAt: string;
}

interface JobCardProps {
  job: Job;
  user?: any;
  isSaved?: boolean;
  onToggleSave?: (jobId: string, currentlySaved: boolean) => void;
  matchScore?: number;
}

const typeColors: Record<string, string> = {
  "full-time": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "part-time": "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "contract": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "remote": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

function timeAgo(date: string) {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
  if (score >= 65) return "text-amber-500 border-amber-500/30 bg-amber-500/10";
  return "text-red-500 border-red-500/30 bg-red-500/10";
}

export default function JobCard({ job, user, isSaved = false, onToggleSave, matchScore }: JobCardProps) {
  return (
    <article
      className="group relative bg-card border border-border rounded-xl p-5 flex flex-col gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Company avatar */}
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 text-base font-bold text-primary group-hover:bg-primary/5 transition-colors">
          {job.company[0]}
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/jobs/${job._id}`}>
            <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors truncate leading-tight mb-0.5">
              {job.title}
            </h3>
          </Link>
          <p className="text-xs font-medium text-muted-foreground">
            {job.company}
          </p>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-3 text-[11px] font-medium text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {job.location}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {job.salary}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeAgo(job.createdAt)}
        </span>
      </div>

      {/* Type badge + match score */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`inline-flex text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${typeColors[job.type] ?? "bg-muted text-muted-foreground border-border"}`}
        >
          {job.type}
        </span>
        {matchScore != null && (
          <span
            className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${scoreColor(matchScore)}`}
          >
            <Zap className="w-2.5 h-2.5 fill-current" />
            {matchScore}% match
          </span>
        )}
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {job.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="bg-muted/50 text-muted-foreground border-transparent px-2 py-0 text-[10px] font-semibold">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 3 && (
            <span className="text-[10px] font-bold text-muted-foreground/60 self-center ml-1">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
        <span className="text-[11px] font-semibold text-muted-foreground/80">
          {job.applicationCount} applicant{job.applicationCount !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-2">
          {user?.role === "seeker" && onToggleSave && (
            <button
              onClick={() => onToggleSave(job._id, isSaved)}
              className="text-muted-foreground hover:text-primary transition-all duration-200 p-1.5 hover:bg-primary/5 rounded-full"
              aria-label={isSaved ? "Unsave job" : "Save job"}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-primary fill-primary/10" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          )}
          <Link href={`/jobs/${job._id}`}>
            <Button size="sm" variant="outline" className="h-8 rounded-full px-4 text-[11px] font-bold border-border hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
              View Role
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
