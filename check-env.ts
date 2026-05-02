
console.log("Checking environment variables...");
console.log("NEXT_PUBLIC_SUPABASE_URL set:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("SUPABASE_SERVICE_ROLE_KEY set:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("CRITICAL: SUPABASE_SERVICE_ROLE_KEY is MISSING in this environment.");
} else {
  console.log("SUCCESS: SUPABASE_SERVICE_ROLE_KEY is loaded.");
}
