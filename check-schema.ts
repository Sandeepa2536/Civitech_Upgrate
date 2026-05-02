import { supabaseAdmin } from "./lib/supabase";

async function checkSchema() {
  const { data, error } = await supabaseAdmin
    .from('qualifications')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error("Error fetching qualifications:", error);
  } else {
    console.log("Sample qualification record:", data[0]);
  }

  const { data: columns, error: colError } = await supabaseAdmin
    .rpc('get_table_columns', { table_name_param: 'qualifications' });

  if (colError) {
    // If RPC doesn't exist, try raw query via site_content if possible? No.
    // Let's try to just fetch one record and look at keys.
    console.log("Keys in qualifications table:", data && data[0] ? Object.keys(data[0]) : "No data");
  } else {
    console.log("Columns:", columns);
  }
}

checkSchema();
