"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight, Briefcase } from "lucide-react";

export default function SignInPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") router.push(callbackUrl);
  }, [status, router, callbackUrl]);

  useEffect(() => {
    const verified = searchParams.get("verified");
    const urlError = searchParams.get("error");
    
    if (verified === "true") {
      setSuccess("Email verified successfully! You can now sign in.");
    }
    
    if (urlError === "InvalidToken") {
      setError("Invalid or missing verification token.");
    } else if (urlError === "TokenExpired") {
      setError("Verification token has expired. Please register again.");
    } else if (urlError && urlError !== "CredentialsSignin") {
      setError(urlError);
    }
  }, [searchParams]);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!result || result.error || !result.ok) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Invalid email or password");
      setLoading(false);
    }
  }

  function handleOAuth(provider: string) {
    setOauthLoading(provider);
    signIn(provider, { callbackUrl });
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(108,99,255,0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      {/* Logo */}
      <div className="relative z-10 mb-8 flex items-center justify-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-3xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
            Hired<span className="text-primary">.</span>
          </span>
        </Link>
      </div>

      <div className="relative w-full max-w-[400px] z-10 group/card">
        {/* Border Beam Effect */}
        <div className="absolute -inset-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-[26px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" 
          style={{
            mask: 'linear-gradient(white, white) content-box, linear-gradient(white, white)',
            maskComposite: 'exclude',
            padding: '2px',
            animation: 'borderBeam 4s linear infinite'
          }}
        />

        <div className="relative rounded-3xl bg-gradient-to-br from-primary/20 via-primary/5 to-primary/10 border border-primary/20 shadow-2xl backdrop-blur-xl overflow-hidden p-8">
          {/* Dual-Point Signature Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none z-0" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none z-0" />
          
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

          <div className="relative z-10">
            <h1 className="text-xl font-medium text-white mb-1">Welcome back</h1>
            <p className="text-sm text-zinc-400 mb-8">
              Sign in to your account to continue
            </p>

            {/* Success */}
            {success && (
              <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-xs font-medium text-green-400">{success}</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-6 px-4 py-3 bg-red-light border border-red-dark/20 rounded-lg">
                <p className="text-xs font-medium text-red-dark">{error}</p>
              </div>
            )}

            {/* OAuth buttons */}
            <div className="flex flex-col gap-2 mb-6">
              <button
                onClick={() => handleOAuth("google")}
                disabled={!!oauthLoading}
                className="flex items-center justify-center gap-3 w-full h-10 bg-white/[0.05] border border-white/[0.08] rounded-lg text-sm text-white/80 hover:bg-white/[0.08] hover:text-white transition-colors disabled:opacity-50"
              >
                {oauthLoading === "google" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.75c.87-2.6 3.3-4.44 6.16-4.44z" fill="#EA4335"/>
                  </svg>
                )}
                Continue with Google
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOAuth("github")}
                  disabled={!!oauthLoading}
                  className="flex items-center justify-center gap-2 h-10 bg-white/[0.05] border border-white/[0.08] rounded-lg text-sm text-white/80 hover:bg-white/[0.08] hover:text-white transition-colors disabled:opacity-50"
                >
                  {oauthLoading === "github" ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  )}
                  GitHub
                </button>

                <button
                  onClick={() => handleOAuth("linkedin")}
                  disabled={!!oauthLoading}
                  className="flex items-center justify-center gap-2 h-10 bg-white/[0.05] border border-white/[0.08] rounded-lg text-sm text-white/80 hover:bg-white/[0.08] hover:text-white transition-colors disabled:opacity-50"
                >
                  {oauthLoading === "linkedin" ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  )}
                  LinkedIn
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-[11px] text-zinc-500 uppercase tracking-wide">or</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            {/* Credentials form */}
            <form onSubmit={handleCredentials} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-10 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/60 focus:bg-white/[0.07] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-zinc-400">
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-[11px] text-zinc-500 hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/60 focus:bg-white/[0.07] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 h-10 w-full bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 mt-1"
              >
                {loading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-zinc-500 mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes borderBeam {
          0%, 100% { clip-path: inset(0 0 95% 0); }
          25% { clip-path: inset(0 95% 0 0); }
          50% { clip-path: inset(95% 0 0 0); }
          75% { clip-path: inset(0 0 0 95%); }
        }
      `}</style>
    </div>
  );
}