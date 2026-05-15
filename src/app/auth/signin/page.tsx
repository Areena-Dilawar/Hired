"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole, Loader2, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

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
        {/* Border Beam Effect - Activates on Hover only */}
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
              Welcome Back
            </CardTitle>
            <CardDescription className="text-zinc-500 font-medium text-sm tracking-wide">
              Sign in to your account to continue
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
                  id="email"
                  type="email"
                  disabled={isLoading}
                  placeholder=" "
                  className="peer w-full h-12 bg-transparent border-b border-white/10 text-white text-base outline-none focus:ring-0 transition-all placeholder:opacity-0"
                  {...register("email")}
                />
                <Label 
                  htmlFor="email"
                  className="absolute left-0 top-3 text-zinc-500 text-base transition-all duration-300 pointer-events-none peer-focus:top-[-10px] peer-focus:text-primary peer-focus:text-[10px] peer-focus:font-black peer-focus:uppercase peer-focus:tracking-[0.2em] peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.2em]"
                >
                  Email Address
                </Label>
                <div className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 peer-focus:left-0 peer-focus:w-full" />
                {errors.email && (
                  <p className="text-[10px] text-destructive font-black uppercase tracking-widest mt-2 ml-0 animate-pulse">{errors.email.message}</p>
                )}
              </div>

              <div className="relative group/field">
                <div className="absolute right-0 top-[-10px] z-20">
                  <Link
                    href="/auth/forgot-password"
                    className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-primary transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
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
                  Password
                </Label>
                <div className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 peer-focus:left-0 peer-focus:w-full" />
                {errors.password && (
                  <p className="text-[10px] text-destructive font-black uppercase tracking-widest mt-2 ml-0 animate-pulse">{errors.password.message}</p>
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
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.4em]">
                <span className="bg-[#0b0b14] px-4 text-zinc-700">
                  Or Continue With
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={() => handleOAuthSignIn("google")}
                className="h-11 rounded-full border-white/5 bg-white/[0.03] text-white hover:bg-white/[0.08] active:scale-[0.98] transition-all flex items-center justify-center gap-2 px-2 shadow-sm group/btn overflow-hidden"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-[10px] font-black tracking-widest opacity-60 group-hover/btn:opacity-100 transition-opacity truncate">Google</span>
              </Button>

              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={() => handleOAuthSignIn("github")}
                className="h-11 rounded-full border-white/5 bg-white/[0.03] text-white hover:bg-white/[0.08] active:scale-[0.98] transition-all flex items-center justify-center gap-2 px-2 shadow-sm group/btn overflow-hidden"
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-[10px] font-black tracking-widest opacity-60 group-hover/btn:opacity-100 transition-opacity truncate">GitHub</span>
              </Button>

              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={() => handleOAuthSignIn("linkedin")}
                className="h-11 rounded-full border-white/5 bg-white/[0.03] text-white hover:bg-white/[0.08] active:scale-[0.98] transition-all flex items-center justify-center gap-2 px-2 shadow-sm group/btn overflow-hidden"
              >
                <svg className="w-4 h-4 text-[#0A66C2] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span className="text-[10px] font-black  tracking-widest opacity-60 group-hover/btn:opacity-100 transition-opacity truncate">LinkedIn</span>
              </Button>
            </div>
          </CardContent>

          <CardFooter className="pb-10 pt-0 px-10 relative z-10">
            <p className="text-center text-zinc-500 font-medium w-full text-xs">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-primary font-bold hover:text-white transition-colors"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
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
