"use server";

import { supabaseAdmin } from "@/lib/supabase";

export async function getAuditLogs(page = 0, pageSize = 20) {
  try {
    const { data, error, count } = await supabaseAdmin
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) throw error;

    return { 
      success: true, 
      logs: data || [], 
      total: count || 0 
    };
  } catch (error: any) {
    console.error("Error fetching audit logs:", error.message);
    return { error: error.message };
  }
}

export async function getAuditStats() {
  try {
    const { count: totalEvents } = await supabaseAdmin
      .from('audit_logs')
      .select('*', { count: 'exact', head: true });

    // Count distinct tables being audited
    const { data: tables } = await supabaseAdmin
      .from('audit_logs')
      .select('table_name');
    
    const uniqueTables = new Set(tables?.map(t => t.table_name)).size;

    return {
      success: true,
      totalEvents: totalEvents || 0,
      uniqueTables: uniqueTables || 0,
      activeAdmins: 1 // This would normally be calculated from session logs
    };
  } catch (error: any) {
    return { error: error.message };
  }
}
