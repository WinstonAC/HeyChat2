"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
// STATUS CHECK: This file requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.
// STATUS CHECK: No .env file was found in the project root. These variables must be set for Supabase client to initialize correctly.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl)
    throw new Error("Missing SUPABASE_URL");
if (!supabaseAnonKey)
    throw new Error("Missing SUPABASE_ANON_KEY");
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
