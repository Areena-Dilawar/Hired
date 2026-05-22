"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight, Briefcase, Building2, Search, CheckCircle } from "lucide-react";

type Role = "seeker" | "employer";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("seeker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState<"register" | "otp">("register");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (role === "employer" && !company) {
      setError("Company name is required for employers");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, company }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        setLoading(false);
        return;
      }

      if (data.status === "OTP_SENT") {
        setStep("otp");
        setCooldown(30); // Start 30 seconds cooldown for resending
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError("Please enter a 6-digit code");
      return;
    }
    setVerifying(true);
    setOtpError("");
    setResendMessage("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error ?? "Verification failed");
        return;
      }

      setSuccess(true);
    } catch (err) {
      setOtpError("Something went wrong. Please try again.");
    } finally {
      setVerifying(false);
    }
  }

  async function handleResendOtp() {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setOtpError("");
    setResendMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, company }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error ?? "Failed to resend code");
      } else {
        setResendMessage("Verification code resent successfully!");
        setCooldown(30);
      }
    } catch (err) {
      setOtpError("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute inset-0 opacity-[0.05]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(108,99,255,0.1) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} 
          />
        </div>

        <div className="relative z-10 mb-8 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-3xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
              Hired<span className="text-primary">.</span>
            </span>
          </Link>
        </div>

        <div className="relative w-full max-w-[420px] z-10 group/card">
          <div className="absolute -inset-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-[26px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" 
            style={{
              mask: 'linear-gradient(white, white) content-box, linear-gradient(white, white)',
              maskComposite: 'exclude',
              padding: '2px',
              animation: 'borderBeam 4s linear infinite'
            }}
          />

          <div className="relative rounded-3xl bg-gradient-to-br from-primary/20 via-primary/5 to-primary/10 border border-primary/20 shadow-2xl backdrop-blur-xl overflow-hidden p-8 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none z-0" />
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

            <div className="relative z-10">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-6 border border-green-500/20">
                <CheckCircle size={28} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Account Verified!
              </h1>
              <p className="text-sm text-zinc-400 mb-8 font-sans">
                Your email has been successfully verified. You can now access your account.
              </p>
              
              <Link href="/auth/signin">
                <button className="flex items-center justify-center gap-2 h-10 w-full bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer">
                  Go to Sign In
                  <ArrowRight size={14} />
                </button>
              </Link>
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

  if (step === "otp") {
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

        <div className="relative w-full max-w-[420px] z-10 group/card">
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
              <h1 className="text-xl font-medium text-white mb-1 text-center font-sans">
                Verify your email
              </h1>
              <p className="text-sm text-zinc-400 mb-6 text-center font-sans">
                Enter the 6-digit code sent to <strong className="text-white font-semibold">{email}</strong>
              </p>

              {otpError && (
                <div className="mb-5 px-4 py-3 bg-red-light border border-red-dark/20 rounded-lg">
                  <p className="text-xs font-medium text-red-dark text-center">{otpError}</p>
                </div>
              )}

              {resendMessage && (
                <div className="mb-5 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-xs font-medium text-green-400 text-center font-sans">{resendMessage}</p>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 text-center font-sans">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // allow only numbers
                      setOtp(value);
                    }}
                    placeholder="••••••"
                    className="w-full h-12 bg-white/[0.05] border border-white/[0.08] rounded-lg text-lg font-mono font-bold tracking-[0.5em] text-center text-white placeholder:text-zinc-600 outline-none focus:border-primary/60 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifying || otp.length !== 6}
                  className="flex items-center justify-center gap-2 h-10 w-full bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 mt-1 cursor-pointer"
                >
                  {verifying ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <>
                      Verify Code
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center text-xs mt-6 text-zinc-500 font-sans">
                Didn't receive the code?{" "}
                {cooldown > 0 ? (
                  <span className="text-zinc-400 font-medium">
                    Resend in {cooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="text-primary hover:underline font-medium focus:outline-none disabled:opacity-50 cursor-pointer"
                  >
                    {resending ? "Sending..." : "Resend code"}
                  </button>
                )}
              </div>

              <div className="text-center text-xs mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep("register");
                    setOtp("");
                    setOtpError("");
                    setResendMessage("");
                  }}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer font-sans"
                >
                  ← Back to registration
                </button>
              </div>
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

      <div className="relative w-full max-w-[420px] z-10 group/card">
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
            <h1 className="text-xl font-medium text-white mb-1">
              Create your account
            </h1>
            <p className="text-sm text-zinc-400 mb-6">
              Join thousands of professionals on Hired.
            </p>

            {/* Role selector */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button
                type="button"
                onClick={() => setRole("seeker")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border text-sm transition-colors cursor-pointer ${
                  role === "seeker"
                    ? "bg-primary/20 border-primary/40 text-white"
                    : "bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <Search size={18} />
                <span className="font-medium">I'm job hunting</span>
                <span className="text-[11px] opacity-70">Find your next role</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("employer")}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border text-sm transition-colors cursor-pointer ${
                  role === "employer"
                    ? "bg-primary/20 border-primary/40 text-white"
                    : "bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <Building2 size={18} />
                <span className="font-medium">I'm hiring</span>
                <span className="text-[11px] opacity-70">Post jobs & find talent</span>
              </button>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 bg-red-light border border-red-dark/20 rounded-lg">
                <p className="text-xs font-medium text-red-dark">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="w-full h-10 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/60 transition-colors"
                />
              </div>

              {role === "employer" && (
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Company name
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Inc."
                    className="w-full h-10 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-10 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/60 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full h-10 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-primary/60 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 h-10 w-full bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 mt-1 cursor-pointer"
              >
                {loading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <>
                    Create account
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-zinc-500 mt-6 font-sans">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-zinc-500 mt-4 px-4 font-sans">
          By creating an account you agree to our{" "}
          <Link href="#" className="text-primary/70 hover:text-primary transition-colors font-medium">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-primary/70 hover:text-primary transition-colors font-medium">
            Privacy Policy
          </Link>
        </p>
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