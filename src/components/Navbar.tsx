"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { 
  Menu, 
  X, 
  Briefcase, 
  ChevronDown, 
  LogOut, 
  User, 
  Bookmark, 
  LayoutDashboard,
  Plus,
  FileText
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = session?.user;

  const initials = user?.name ? getInitials(user.name) : "U";

  const isEmployer = user?.role === "employer" || user?.role === "admin";
  const isSeeker = user?.role === "seeker" || user?.role === "admin";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              Hired<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Center nav — desktop */}
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/jobs">
              <Button variant="ghost" size="sm" className="font-medium text-muted-foreground hover:text-foreground">
                Browse Jobs
              </Button>
            </Link>
            {isSeeker && (
              <Link href="/saved">
                <Button variant="ghost" size="sm" className="font-medium text-muted-foreground hover:text-foreground">
                  Saved Jobs
                </Button>
              </Link>
            )}
            {isEmployer && (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="font-medium text-muted-foreground hover:text-foreground">
                  Dashboard
                </Button>
              </Link>
            )}
          </nav>

          {/* Right: auth + theme */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {!user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="rounded-full px-5">Get started</Button>
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-transform active:scale-95">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl border-border shadow-lg">
                  <div className="px-2 py-2">
                    <p className="text-sm font-semibold text-foreground leading-none mb-1">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                      {user.role}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-lg focus:bg-accent focus:text-accent-foreground cursor-pointer">
                    <Link href="/profile" className="flex w-full items-center">
                      <User className="mr-2 w-4 h-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  {isSeeker && (
                    <DropdownMenuItem asChild className="rounded-lg focus:bg-accent focus:text-accent-foreground cursor-pointer">
                      <Link href="/saved" className="flex w-full items-center">
                        <Bookmark className="mr-2 w-4 h-4" /> Saved Jobs
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isEmployer && (
                    <DropdownMenuItem asChild className="rounded-lg focus:bg-accent focus:text-accent-foreground cursor-pointer">
                      <Link href="/dashboard" className="flex w-full items-center">
                        <LayoutDashboard className="mr-2 w-4 h-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 w-4 h-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          <Link href="/jobs" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Browse Jobs
          </Link>
          {isSeeker && (
            <Link href="/saved" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Saved Jobs
            </Link>
          )}
          {isEmployer && (
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
          )}
          {!user ? (
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Link href="/auth/signin" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="w-full rounded-lg">Sign in</Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMenuOpen(false)}>
                <Button className="w-full rounded-lg">Get started</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <User size={16} /> Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors flex items-center gap-2 text-left"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
