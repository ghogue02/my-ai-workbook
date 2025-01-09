// File: lib/savePhaseData.ts
import { supabase } from "./supabaseClient";

/**
 * Upsert workbook data for a given user + phase into the "workbook_responses" table.
 *
 * @param userId  The user's ID (from Supabase session.user.id).
 * @param phase   Which phase we're saving, e.g. "Project Setup", "Planning", etc.
 * @param data    The actual form data you want to store.
 */
export async function savePhaseData(
  userId: string,
  phase: string,
  data: unknown
): Promise<void> {
  // Fetch existing row for this user + phase
  const { data: existing, error } = await supabase
    .from("workbook_responses")
    .select("id")
    .eq("user_id", userId)
    .eq("phase", phase)
    .single();

  if (error) {
    console.error("Error fetching record:", error);
    // We'll continue, because it might just be a "No record found" type of error
  }

  if (!existing) {
    // Insert a new row
    const { error: insertError } = await supabase.from("workbook_responses").insert({
      user_id: userId,
      phase,
      data,
    });

    if (insertError) {
      console.error("Error inserting new row:", insertError);
    }
  } else {
    // Update existing row
    const { error: updateError } = await supabase
      .from("workbook_responses")
      .update({ data })
      .eq("id", existing.id);

    if (updateError) {
      console.error("Error updating existing row:", updateError);
    }
  }
}