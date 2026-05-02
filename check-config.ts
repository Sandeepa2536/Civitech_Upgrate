
import { supabase } from "./lib/supabase";

async function checkConfig() {
  console.log("Supabase Config Check:");
  // @ts-ignore
  console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  const { data, error } = await supabase.from('members').select('id, member_profile(path)').limit(5);
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Data sample:", JSON.stringify(data, null, 2));
  }
}

checkConfig();
