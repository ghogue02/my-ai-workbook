// File: app/(auth)/login/page.tsx
"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      alert("Error sending magic link: " + error.message);
    } else {
      alert("Check your email for a magic link!");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl mb-4">Sign In</h1>
      <form onSubmit={handleSignIn}>
        <input
          className="border p-2 w-full mb-4"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded"
          type="submit"
        >
          Send Magic Link
        </button>
      </form>
    </div>
  );
}