import { DefaultSession, DefaultJWT } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      isBanned: boolean;
      originalRole?: Role;
    } & DefaultSession["user"];
    impersonatedRole?: Role;
    clearImpersonation?: boolean;
  }

  interface User {
    role: Role;
    isBanned: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: Role;
    isBanned: boolean;
    lastChecked: number;
    impersonatedRole?: Role;
  }
}
