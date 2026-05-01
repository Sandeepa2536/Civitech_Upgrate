"use server";

import { supabaseAdmin } from '@/lib/supabase';

export async function getInquiries() {
  try {
    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data };
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error fetching inquiries:', error.message);
    return { error: error.message };
  }
}

export async function updateInquiryStatus(id: number, status: string) {
  try {
    const { error } = await supabaseAdmin
      .from('inquiries')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error updating inquiry status:', error.message);
    return { error: error.message };
  }
}

export async function getDashboardStats() {
  try {
    const [{ count: projCount }, { count: jobCount }, { count: msgCount }, { data: recentInquiries }] = await Promise.all([
      supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('vacancies').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('inquiries').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('inquiries').select('*').order('created_at', { ascending: false }).limit(3)
    ]);

    return {
      projects: projCount || 0,
      jobs: jobCount || 0,
      inquiries: msgCount || 0,
      recentInquiries: recentInquiries || []
    };
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error fetching dashboard stats:', error.message);
    return { error: error.message };
  }
}
