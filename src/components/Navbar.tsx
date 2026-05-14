"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Briefcase, ChevronDown, LogOut, User, Bookmark, LayoutDashboard } from "lucide-react";
import { getInitials } from "@/lib/utils";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = session?.user;

  return (
    <nav className="bg-obsidian border-b border-white/[0.06] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-iris rounded-lg flex items-center justify-center">
            <Briefcase size={14} className="text-white" />
          </div>
          <span className="text-white font-medium text-base tracking-tight">
            Hired.
          </span>
        </Link>

        {/* Centre links — desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/jobs"
            className="text-sm text-white/60 hover:text-white transition-colors duration-150"
          >
            Browse jobs
          </Link>
          {user?.role === "employer" && (
            <Link
              href="/dashboard"
              className="text-sm text-white/60 hover:text-white transition-colors duration-150"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right side — desktop */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link
                href="/auth/signin"
                className="text-sm text-white/60 hover:text-white transition-colors duration-150"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="text-sm bg-iris text-white px-4 py-1.5 rounded-lg hover:bg-[#5952D4] transition-colors duration-150"
              >
                Get started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {user.role === "employer" && (
                <Link
                  href="/jobs/new"
                  className="text-sm bg-iris text-white px-4 py-1.5 rounded-lg hover:bg-[#5952D4] transition-colors duration-150"
                >
                  Post a job
                </Link>
              )}

              {/* Avatar dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name ?? ""}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-iris flex items-center justify-center text-white text-xs font-medium">
                      {getInitials(user.name ?? "U")}
                    </div>
                  )}
                  <span className="text-sm text-white/80">{user.name}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wide bg-iris-light text-iris-mid px-1.5 py-0.5 rounded-full">
                    {user.role}
                  </span>
                  <ChevronDown size={14} className="text-white/40" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200/60 rounded-xl shadow-lg py-1 z-50">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-pri hover:bg-gray-50 transition-colors"
                    >
                      <User size={14} />
                      Profile
                    </Link>
                    {user.role === "seeker" && (
                      <Link
                        href="/saved"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-pri hover:bg-gray-50 transition-colors"
                      >
                        <Bookmark size={14} />
                        Saved jobs
                      </Link>
                    )}
                    {user.role === "employer" && (
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-pri hover:bg-gray-50 transition-colors"
                      >
                        <LayoutDashboard size={14} />
                        Dashboard
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-pri hover:bg-gray-50 transition-colors"
                      >
                        <LayoutDashboard size={14} />
                        Admin
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-dark hover:bg-red-light w-full transition-colors"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/60 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-obsidian border-t border-white/[0.06] px-4 py-4 flex flex-col gap-3">
          <Link
            href="/jobs"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Browse jobs
          </Link>
          {!user ? (
            <>
              <Link
                href="/auth/signin"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMenuOpen(false)}
                className="text-sm bg-iris text-white px-4 py-2 rounded-lg text-center hover:bg-[#5952D4] transition-colors"
              >
                Get started
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-sm text-white/60 hover:text-white transition-colors">Profile</Link>
              {user.role === "seeker" && (
                <Link href="/saved" onClick={() => setMenuOpen(false)} className="text-sm text-white/60 hover:text-white transition-colors">Saved jobs</Link>
              )}
              {user.role === "employer" && (
                <>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm text-white/60 hover:text-white transition-colors">Dashboard</Link>
                  <Link href="/jobs/new" onClick={() => setMenuOpen(false)} className="text-sm bg-iris text-white px-4 py-2 rounded-lg text-center hover:bg-[#5952D4] transition-colors">Post a job</Link>
                </>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-red-dark text-left hover:opacity-80 transition-opacity"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}