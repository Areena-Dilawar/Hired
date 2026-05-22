import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const OTP_TTL_SECONDS = 600; // 10 minutes

export interface PendingUser {
  name: string;
  email: string;
  passwordHash: string;
  role: "employer" | "seeker";
  company?: string;
  otp: string;
  attempts: number;
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storePendingUser(email: string, pendingUser: PendingUser): Promise<void> {
  const key = `pending-register:${email.toLowerCase().trim()}`;
  await redis.set(key, JSON.stringify(pendingUser), { ex: OTP_TTL_SECONDS });
}

export async function getPendingUser(email: string): Promise<PendingUser | null> {
  const key = `pending-register:${email.toLowerCase().trim()}`;
  const data = await redis.get<any>(key);
  if (!data) return null;
  return typeof data === "string" ? JSON.parse(data) : data;
}

export async function deletePendingUser(email: string): Promise<void> {
  const key = `pending-register:${email.toLowerCase().trim()}`;
  await redis.del(key);
}
