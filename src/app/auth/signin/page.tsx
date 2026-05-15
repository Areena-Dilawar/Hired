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

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-obsidian px-4 py-12 relative min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Background Dots Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15]" 
        style={{ 
          backgroundImage: `radial-gradient(circle, rgba(108,99,255,0.15) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} 
      />

      {/* Prominent Glow Effects (Home Page Style) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] opacity-70" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/15 rounded-full blur-[100px] opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-[400px] relative z-10 border-white/5 bg-obsidian/60 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="space-y-2 pt-12 text-center px-6">
          <CardTitle className="text-3xl font-display font-bold tracking-tight text-white">Welcome Back</CardTitle>
          <CardDescription className="text-zinc-400 font-medium text-sm">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-xl font-medium animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            {/* Email Input */}
            <div className="relative group">
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
              <div className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 group-focus-within:left-0 group-focus-within:w-full" />
              {errors.email && (
                <p className="text-[10px] text-destructive font-black uppercase tracking-widest mt-1.5 ml-0 animate-pulse">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute right-0 top-[-10px] z-20">
                <Link
                  href="/auth/forgot-password"
                  className="text-[9px] font-black uppercase tracking-tighter text-zinc-600 hover:text-primary transition-colors"
                >
                  Forgot?
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
              <div className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 group-focus-within:left-0 group-focus-within:w-full" />
              {errors.password && (
                <p className="text-[10px] text-destructive font-black uppercase tracking-widest mt-1.5 ml-0 animate-pulse">{errors.password.message}</p>
              )}
            </div>

            <Button disabled={isLoading} className="w-full h-12 rounded-xl font-bold text-base mt-2 group shadow-xl shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] transition-all bg-primary hover:bg-primary/90 text-white border-0">
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

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-obsidian/60 px-4 text-zinc-500 font-bold tracking-widest backdrop-blur-md">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={handleGoogleSignIn}
            className="w-full h-12 rounded-xl font-bold border-white/10 bg-white/5 text-white hover:bg-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </Button>
        </CardContent>

        <CardFooter className="pb-8 pt-2 px-8">
          <p className="text-center text-zinc-400 font-medium w-full text-xs">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary font-bold hover:text-lavender transition-colors underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
