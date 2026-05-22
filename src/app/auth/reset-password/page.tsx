"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });

      const resultData = await res.json();

      if (!res.ok) {
        setError(resultData.error || "Failed to reset password");
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !isSuccess) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#030303] px-4 min-h-[calc(100vh-64px)] overflow-hidden">
        <Card className="relative border border-destructive/20 bg-destructive/10 backdrop-blur-3xl shadow-2xl rounded-[24px] p-10 text-center max-w-sm">
          <CardTitle className="text-xl font-display font-bold mb-3 text-destructive">Invalid Link</CardTitle>
          <CardDescription className="text-zinc-400 mb-6">
            The password reset link is missing or invalid.
          </CardDescription>
          <Link href="/auth/forgot-password">
            <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">
              Request New Link
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#030303] px-4 min-h-[calc(100vh-64px)] overflow-hidden relative">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-[150px] animate-pulse" />
        <div className="relative w-full max-w-sm z-10">
          <Card className="relative border border-primary/20 bg-gradient-to-br from-primary/20 via-primary/5 to-primary/10 backdrop-blur-3xl shadow-2xl rounded-[24px] p-10 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-8 border border-primary/20 relative z-10">
              <CheckCircle2 className="w-10 h-10 animate-in zoom-in duration-500" />
            </div>
            <CardTitle className="text-3xl font-display font-bold mb-3 text-white relative z-10">Password Reset!</CardTitle>
            <CardDescription className="text-zinc-500 text-lg mb-8 relative z-10">
              Your password has been changed successfully.
            </CardDescription>
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-zinc-400 hover:text-white gap-2">
                <ArrowLeft className="w-4 h-4" /> Go to Sign In
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-[#030303] px-4 py-12 relative min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(108,99,255,0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} 
        />
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
        
        <Card className="relative rounded-3xl bg-gradient-to-br from-primary/20 via-primary/5 to-primary/10 border border-primary/20 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Dual-Point Signature Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <CardHeader className="space-y-3 pt-12 pb-6 text-center px-8 relative z-10">
            <CardTitle className="text-3xl font-display font-bold tracking-tight text-white">
              Create Password
            </CardTitle>
            <CardDescription className="text-zinc-500 font-medium text-sm tracking-wide">
              Enter a new secure password below
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 px-10 pb-10 relative z-10">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[11px] p-3 rounded-xl font-bold uppercase tracking-widest text-center animate-in zoom-in duration-300">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="relative group/field">
                <input
                  id="password"
                  type="password"
                  disabled={isLoading}
                  placeholder=" "
                  className="peer w-full h-12 bg-transparent border-b border-white/10 text-white text-base outline-none focus:ring-0 transition-all placeholder:opacity-0"
                  {...register("password")}
                />
                <Label 
                  htmlFor="password"
                  className="absolute left-0 top-3 text-zinc-500 text-base transition-all duration-300 pointer-events-none peer-focus:top-[-10px] peer-focus:text-primary peer-focus:text-[10px] peer-focus:font-black peer-focus:uppercase peer-focus:tracking-[0.2em] peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.2em]"
                >
                  New Password
                </Label>
                <div className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 peer-focus:left-0 peer-focus:w-full" />
                {errors.password && (
                  <p className="text-[10px] text-destructive font-black uppercase tracking-widest mt-2 ml-0 animate-pulse">{errors.password.message}</p>
                )}
              </div>

              <div className="relative group/field">
                <input
                  id="confirmPassword"
                  type="password"
                  disabled={isLoading}
                  placeholder=" "
                  className="peer w-full h-12 bg-transparent border-b border-white/10 text-white text-base outline-none focus:ring-0 transition-all placeholder:opacity-0"
                  {...register("confirmPassword")}
                />
                <Label 
                  htmlFor="confirmPassword"
                  className="absolute left-0 top-3 text-zinc-500 text-base transition-all duration-300 pointer-events-none peer-focus:top-[-10px] peer-focus:text-primary peer-focus:text-[10px] peer-focus:font-black peer-focus:uppercase peer-focus:tracking-[0.2em] peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.2em]"
                >
                  Confirm Password
                </Label>
                <div className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 peer-focus:left-0 peer-focus:w-full" />
                {errors.confirmPassword && (
                  <p className="text-[10px] text-destructive font-black uppercase tracking-widest mt-2 ml-0 animate-pulse">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button 
                disabled={isLoading} 
                className="w-full h-11 rounded-full font-black uppercase tracking-widest text-[10px] group relative overflow-hidden bg-primary hover:bg-primary/90 text-white border-0 shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Update Password
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
