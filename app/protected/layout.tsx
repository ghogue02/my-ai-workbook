// app/(protected)/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/src/lib/supabaseClient";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Watch for login/logout changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // If no session, bounce them to /login
  if (!session) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null; // can show a loading spinner instead
  }

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="flex gap-4 p-4 bg-gray-100">
        <Link href="/protected/planning">Planning</Link>
        <Link href="/protected/project-setup">Project Setup</Link>
        <Link href="/protected/building">Building</Link>
        <Link href="/protected/showcase-prep">Showcase Prep</Link>
        <Link href="/protected/demo-reflection">Demo/Reflection</Link>
      </nav>
      
      {/* Main Content */}
      <main className="p-4">{children}</main>
    </div>
  );
}