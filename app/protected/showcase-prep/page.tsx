"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabaseClient";
import { savePhaseData } from "@/lib/savePhaseData";

export default function ShowcasePrepPage() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  // Form fields
  const [presentation, setPresentation] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [notes, setNotes] = useState("");

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
        presentation,
        deliverables,
        notes,
      };
      await savePhaseData(userId, "showcase-prep", formData);
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
      <h1 className="text-2xl font-bold mb-4">Showcase Preparation</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">
          What will you present in your showcase?
          <input
            className="border p-2 w-full mb-4"
            type="text"
            value={presentation}
            onChange={(e) => setPresentation(e.target.value)}
          />
        </label>
        <label className="block mb-2 font-medium">
          List your key deliverables:
          <input
            className="border p-2 w-full mb-4"
            type="text"
            value={deliverables}
            onChange={(e) => setDeliverables(e.target.value)}
          />
        </label>
        <label className="block mb-2 font-medium">
          Additional preparation notes:
          <textarea
            className="border p-2 w-full mb-4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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