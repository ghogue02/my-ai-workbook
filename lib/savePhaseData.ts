import { supabase } from "@/src/lib/supabaseClient";

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
) {
  const { data: result, error } = await supabase
    .from("workbook_responses")
    .upsert(
      {
        user_id: userId,
        phase: phase,
        data: data,
      },
      {
        onConflict: "user_id,phase"
      }
    )
    .select()
    .single();

  if (error) {
    console.error("Error in savePhaseData: ", error);
    throw error;
  }
  
  return result;
}