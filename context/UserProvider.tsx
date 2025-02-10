"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSession } from "next-auth/react";

interface User {
  id: string | undefined;
  email: string | undefined;
  role?: "ADMIN" | "USER" | "PREMIUMUSER";
}

const UserContext = createContext<User | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? undefined,
          role: session.user.role as "ADMIN" | "USER" | "PREMIUMUSER", // Middleware extracts role
        });
      }
    };

    fetchSession();
  }, []);

  return (
    <UserContext.Provider value={user}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
