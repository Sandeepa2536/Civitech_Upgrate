"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addCategoryAction(name: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('category')
      .insert([{ category: name.trim(), status_id: 1 }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function addScopeAction(name: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('project_scope')
      .insert([{ scope: name.trim(), status_id: 1 }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function addClientAction(name: string, logo: string | null) {
  try {
    const { data, error } = await supabaseAdmin
      .from('clients')
      .insert([{ name: name.trim(), logo, status_id: 1 }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function addPartnerAction(name: string, logo: string | null) {
  try {
    const { data, error } = await supabaseAdmin
      .from('partners')
      .insert([{ name: name.trim(), logo, status_id: 1 }])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function renameAssetAction(table: string, id: number, name: string) {
  try {
    const column = table === 'category' ? 'category' : (table === 'project_scope' ? 'scope' : 'name');
    const { error } = await supabaseAdmin
      .from(table)
      .update({ [column]: name.trim() })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateAssetLogoAction(table: string, id: number, logoUrl: string) {
  try {
    const { error } = await supabaseAdmin
      .from(table)
      .update({ logo: logoUrl })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateAssetStatusAction(table: string, id: number, statusId: number) {
  try {
    const { error } = await supabaseAdmin
      .from(table)
      .update({ status_id: statusId })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

