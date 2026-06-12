"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Memeriksa sesi langsung dari Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Mendengarkan perubahan status login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/admin-login");
    }
  }, [isAuthenticated, router]);

  // Show nothing or a loading spinner while checking auth status
  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If not authenticated, return null while router redirects
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
}
