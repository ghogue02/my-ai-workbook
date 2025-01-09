// File: app/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";

// This layout forces a user to be logged in before viewing children.
// If user isn't logged in, we redirect them to /login.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for session changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // If not logged in, redirect to /login (on client side)
  if (!session) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null; // or a loading spinner
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}