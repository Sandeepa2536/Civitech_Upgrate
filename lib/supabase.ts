import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. ' +
    'Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file.'
  );
}

// Public client for client-side fetching (Respects RLS)
export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);

// Admin client for server-side mutations (Bypasses RLS - use only in server actions)
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase;

// Utility to delete files from storage based on public URL
export async function deleteStorageFile(url: string | null) {
  if (!url || !url.includes('storage/v1/object/public/project-images/')) return;
  
  try {
    const path = url.split('project-images/')[1];
    if (path) {
      await supabaseAdmin.storage.from('project-images').remove([path]);
    }
  } catch (error) {
    console.error("Storage Cleanup Error:", error);
  }
}
