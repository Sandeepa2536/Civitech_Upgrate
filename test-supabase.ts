
import { supabaseAdmin } from "./lib/supabase";

async function testConnection() {
  try {
    const { data, error } = await supabaseAdmin.from('projects').select('count', { count: 'exact', head: true });
    if (error) {
      console.error("Connection Test Failed:", error);
    } else {
      console.log("Connection Test Successful. Projects count:", data);
    }
  } catch (e) {
    console.error("Caught error in connection test:", e);
  }
}

testConnection();
