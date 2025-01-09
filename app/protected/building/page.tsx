"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabaseClient"; // update this path if needed
import { savePhaseData } from "@/lib/savePhaseData"; // same note about path

export default function BuildingPage() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Form fields
  const [goal, setGoal] = useState("");
  const [resources, setResources] = useState("");

  useEffect(() => {
    // On mount, get session
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

      // We store all form data in one object
      const formData = {
        goal,
        resources,
      };

      await savePhaseData(userId, "building", formData);

      alert("Data saved successfully!");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      alert("Error saving data: " + errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Building Phase</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">
          What are you building today?
          <input
            className="border p-2 w-full mb-4"
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </label>

        <label className="block mb-2 font-medium">
          Which resources or tools do you plan to use?
          <input
            className="border p-2 w-full mb-4"
            type="text"
            value={resources}
            onChange={(e) => setResources(e.target.value)}
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