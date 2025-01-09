"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { savePhaseData } from "@/lib/savePhaseData"; // your custom function
import { Session } from "@supabase/supabase-js";

export default function ProjectSetupPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({
    projectName: "",
    teamMembers: "",
    department: "",
    // etc...
  });

  // get the session so we know the userId
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    if (!session?.user) return;
    await savePhaseData(session.user.id, "Project Setup", formData);
    alert("Saved!");
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Project Setup</h1>

      <div className="mb-4">
        <label className="block mb-1">Project Name</label>
        <input
          className="border p-2 w-full"
          name="projectName"
          value={formData.projectName}
          onChange={handleChange}
        />
      </div>

      {/* ... repeat for teamMembers, department, etc. ... */}

      <button
        className="bg-blue-600 text-white py-2 px-4 rounded"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}