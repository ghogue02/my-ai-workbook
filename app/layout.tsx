// File: app/layout.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    // if not logged in, force to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

export async function savePhaseData(userId: string, phase: string, data: any) {
    // upsert so we only have one record per user/phase
    // or choose to insert multiple times if you want version history
    const { data: existing, error: fetchError } = await supabase
      .from("workbook_responses")
      .select("id")
      .eq("user_id", userId)
      .eq("phase", phase)
      .single();
  
    if (!existing) {
      // Insert new
      await supabase.from("workbook_responses").insert({
        user_id: userId,
        phase,
        data,
      });
    } else {
      // Update existing
      await supabase
        .from("workbook_responses")
        .update({ data })
        .eq("id", existing.id);
    }
  }