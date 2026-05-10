import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "employer" | "seeker" | "admin";
      avatar?: string;
    };
  }

  interface User {
    id: string;
    role: "employer" | "seeker" | "admin";
    avatar?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "employer" | "seeker" | "admin";
    avatar?: string;
  }
}