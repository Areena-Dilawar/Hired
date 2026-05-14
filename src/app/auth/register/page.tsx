"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, User as UserIcon, Mail, Lock, Building2, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["seeker", "employer"]),
  company: z.string().optional(),
}).refine((data) => {
  if (data.role === "employer" && (!data.company || data.company.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Company name is required for employers",
  path: ["company"],
});

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "seeker",
    }
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to register");
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/auth/signin");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex-1 flex items-center justify-center bg-obsidian px-4 min-h-[calc(100vh-64px)]">
        <Card className="w-full max-w-md border-white/5 bg-obsidian/40 backdrop-blur-xl shadow-2xl rounded-3xl p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
            <CheckCircle2 className="w-10 h-10 animate-in zoom-in" />
          </div>
          <CardTitle className="text-3xl font-display font-bold mb-2 text-white">Registration Successful!</CardTitle>
          <CardDescription className="text-zinc-400 text-lg mb-6">
            Your account has been created. Redirecting to sign in...
          </CardDescription>
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-obsidian px-4 py-12 relative min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Background Grid Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(108,99,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Background Glowing Auras */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/2 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-lg relative z-10 border-white/5 bg-obsidian/40 backdrop-blur-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[32px] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
        
        <CardHeader className="space-y-4 pt-10 text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2 border border-primary/20 shadow-lg shadow-primary/10">
            <UserIcon className="w-7 h-7" />
          </div>
          <CardTitle className="text-4xl font-display font-bold tracking-tight text-white leading-tight">Create an Account</CardTitle>
          <CardDescription className="text-zinc-400 font-medium text-base">
            Join Hired and take the next step in your career
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-8">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-2xl font-medium animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
               <button
                 type="button"
                 onClick={() => register("role").onChange({ target: { value: "seeker", name: "role" } })}
                 className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all gap-2 group relative overflow-hidden ${
                   selectedRole === "seeker" 
                   ? "border-primary bg-primary/10 text-white ring-4 ring-primary/10" 
                   : "border-white/5 bg-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-400"
                 }`}
               >
                 {selectedRole === "seeker" && <div className="absolute inset-0 bg-primary/5 animate-pulse" />}
                 <UserIcon className={`w-7 h-7 relative z-10 ${selectedRole === "seeker" ? "text-primary" : ""}`} />
                 <span className="font-bold text-sm relative z-10">Job Seeker</span>
               </button>
               <button
                 type="button"
                 onClick={() => register("role").onChange({ target: { value: "employer", name: "role" } })}
                 className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all gap-2 group relative overflow-hidden ${
                   selectedRole === "employer" 
                   ? "border-primary bg-primary/10 text-white ring-4 ring-primary/10" 
                   : "border-white/5 bg-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-400"
                 }`}
               >
                 {selectedRole === "employer" && <div className="absolute inset-0 bg-primary/5 animate-pulse" />}
                 <Briefcase className={`w-7 h-7 relative z-10 ${selectedRole === "employer" ? "text-primary" : ""}`} />
                 <span className="font-bold text-sm relative z-10">Employer</span>
               </button>
            </div>

            {/* Name Input */}
            <div className="relative group">
              <input
                id="name"
                disabled={isLoading}
                placeholder=" "
                className="peer w-full h-14 bg-transparent border-b-2 border-white/10 text-white text-lg outline-none focus:ring-0 transition-all placeholder:opacity-0"
                {...register("name")}
              />
              <Label 
                htmlFor="name"
                className="absolute left-0 top-4 text-zinc-500 text-lg transition-all duration-300 pointer-events-none peer-focus:top-[-12px] peer-focus:text-primary peer-focus:text-xs peer-focus:font-black peer-focus:uppercase peer-focus:tracking-[0.2em] peer-[:not(:placeholder-shown)]:top-[-12px] peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.2em]"
              >
                Full Name
              </Label>
              <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 group-focus-within:left-0 group-focus-within:w-full" />
              {errors.name && (
                <p className="text-[10px] text-destructive font-black uppercase tracking-widest mt-2 ml-0 animate-pulse">{errors.name.message}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="relative group">
              <input
                id="email"
                type="email"
                disabled={isLoading}
                placeholder=" "
                className="peer w-full h-14 bg-transparent border-b-2 border-white/10 text-white text-lg outline-none focus:ring-0 transition-all placeholder:opacity-0"
                {...register("email")}
              />
              <Label 
                htmlFor="email"
                className="absolute left-0 top-4 text-zinc-500 text-lg transition-all duration-300 pointer-events-none peer-focus:top-[-12px] peer-focus:text-primary peer-focus:text-xs peer-focus:font-black peer-focus:uppercase peer-focus:tracking-[0.2em] peer-[:not(:placeholder-shown)]:top-[-12px] peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.2em]"
              >
                Email Address
              </Label>
              <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 group-focus-within:left-0 group-focus-within:w-full" />
              {errors.email && (
                <p className="text-[10px] text-destructive font-black uppercase tracking-widest mt-2 ml-0 animate-pulse">{errors.email.message}</p>
              )}
            </div>

            {selectedRole === "employer" && (
              <div className="relative group animate-in slide-in-from-top-2 duration-300">
                <input
                  id="company"
                  disabled={isLoading}
                  placeholder=" "
                  className="peer w-full h-14 bg-transparent border-b-2 border-white/10 text-white text-lg outline-none focus:ring-0 transition-all placeholder:opacity-0"
                  {...register("company")}
                />
                <Label 
                  htmlFor="company"
                  className="absolute left-0 top-4 text-zinc-500 text-lg transition-all duration-300 pointer-events-none peer-focus:top-[-12px] peer-focus:text-primary peer-focus:text-xs peer-focus:font-black peer-focus:uppercase peer-focus:tracking-[0.2em] peer-[:not(:placeholder-shown)]:top-[-12px] peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.2em]"
                >
                  Company Name
                </Label>
                <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 group-focus-within:left-0 group-focus-within:w-full" />
                {errors.company && (
                  <p className="text-[10px] text-destructive font-black uppercase tracking-widest mt-2 ml-0 animate-pulse">{errors.company.message}</p>
                )}
              </div>
            )}

            {/* Password Input */}
            <div className="relative group">
              <input
                id="password"
                type="password"
                disabled={isLoading}
                placeholder=" "
                className="peer w-full h-14 bg-transparent border-b-2 border-white/10 text-white text-lg outline-none focus:ring-0 transition-all placeholder:opacity-0"
                {...register("password")}
              />
              <Label 
                htmlFor="password"
                className="absolute left-0 top-4 text-zinc-500 text-lg transition-all duration-300 pointer-events-none peer-focus:top-[-12px] peer-focus:text-primary peer-focus:text-xs peer-focus:font-black peer-focus:uppercase peer-focus:tracking-[0.2em] peer-[:not(:placeholder-shown)]:top-[-12px] peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.2em]"
              >
                Password
              </Label>
              <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 group-focus-within:left-0 group-focus-within:w-full" />
              {errors.password && (
                <p className="text-[10px] text-destructive font-black uppercase tracking-widest mt-2 ml-0 animate-pulse">{errors.password.message}</p>
              )}
            </div>

            <Button disabled={isLoading} className="w-full h-14 rounded-2xl font-black text-lg uppercase tracking-widest mt-8 group shadow-2xl shadow-primary/40 hover:shadow-primary/60 active:scale-[0.98] transition-all bg-primary hover:bg-primary/90 text-white border-0">
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center">
                  Complete Registration
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="pb-10 pt-4 px-8">
          <p className="text-center text-zinc-400 font-medium w-full">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-primary font-bold hover:text-lavender transition-colors underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
