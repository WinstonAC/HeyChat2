import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

// Log environment variables (without exposing values)
console.log("🔧 Supabase Configuration:", {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Found" : "❌ Missing",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Found" : "❌ Missing",
  timestamp: new Date().toISOString()
});

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Verify connection
const verifyConnection = async () => {
  try {
    const { data, error } = await supabase.from("comments").select("count").limit(1);
    if (error) {
      console.error("❌ Supabase connection test failed:", {
        error,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log("✅ Supabase connection verified:", {
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    console.error("🚨 Unexpected connection error:", {
      error: err,
      timestamp: new Date().toISOString()
    });
  }
};

verifyConnection(); 