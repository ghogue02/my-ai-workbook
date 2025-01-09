"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabaseClient";
import { savePhaseData } from "@/lib/savePhaseData";

export default function DemoReflectionPage() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  // Form fields
  const [achievements, setAchievements] = useState("");
  const [challenges, setChallenges] = useState("");
  const [nextSteps, setNextSteps] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return alert("No user session found.");
    try {
      setLoading(true);
      const formData = {
        achievements,
        challenges,
        nextSteps,
      };
      await savePhaseData(userId, "demo-reflection", formData);
      alert("Data saved successfully!");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      alert("Error saving data: " + errorMessage);
      setLoading(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Demo & Reflection</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">
          What were your key achievements?
          <textarea
            className="border p-2 w-full mb-4"
            value={achievements}
            onChange={(e) => setAchievements(e.target.value)}
          />
        </label>
        <label className="block mb-2 font-medium">
          What challenges did you face and how did you overcome them?
          <textarea
            className="border p-2 w-full mb-4"
            value={challenges}
            onChange={(e) => setChallenges(e.target.value)}
          />
        </label>
        <label className="block mb-2 font-medium">
          What are your next steps?
          <textarea
            className="border p-2 w-full mb-4"
            value={nextSteps}
            onChange={(e) => setNextSteps(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}