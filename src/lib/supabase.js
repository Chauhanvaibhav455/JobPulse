
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kcmaticraujricuxhqnt.supabase.co";
const supabaseKey = "sb_publishable_5duHdk92NhkwmVyGkxfElw_fGQLtFg6";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variables are missing.");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
