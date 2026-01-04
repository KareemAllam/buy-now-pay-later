import { UserRole } from "@/types/db-json.types";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      name: string;
      email: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
    name: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  full_name: string;
  email: string;
  password: string;
  role?: UserRole;
}

