"use client";
import { useState } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push('/protected/building');
    } catch (error) {
      alert('Error signing in: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      alert('Check your email to confirm your account!');
    } catch (error) {
      alert('Error signing up: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl mb-4">Sign In or Sign Up</h1>
      <form className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            className="border p-2 w-full rounded"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            className="border p-2 w-full rounded"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="bg-green-600 text-white py-2 px-4 rounded"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
}