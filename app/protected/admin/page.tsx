"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/src/lib/supabaseClient";

type WorkbookResponse = {
  phase: string;
  count: number;
};

export default function AdminPage() {
  const [phaseCounts, setPhaseCounts] = useState<WorkbookResponse[]>([]);

  useEffect(() => {
    async function fetchPhaseCounts() {
      const { data: rowData, error } = await supabase
        .rpc('get_phase_counts');

      if (error) {
        console.error("Error fetching phase counts: ", error);
        return;
      }

      if (rowData) {
        setPhaseCounts(rowData as WorkbookResponse[]);
      }
    }

    fetchPhaseCounts();
  }, []);

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Analytics</h1>
      <ul>
        {phaseCounts.map((item) => (
          <li key={item.phase}>
            Phase <strong>{item.phase}</strong>: {item.count} response(s)
          </li>
        ))}
      </ul>
    </div>
  );
}