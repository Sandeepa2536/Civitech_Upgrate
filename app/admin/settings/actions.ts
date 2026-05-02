"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { verifyToken, comparePassword, hashPassword } from "@/lib/auth";

export async function updateSiteContentAction(key: string, value: string) {
  try {
    // We use upsert on the 'key' column. 
    // Ensure the database has a unique constraint on the 'key' column.
    const { error } = await supabaseAdmin
      .from('site_content')
      .upsert({ key: key, value: value }, { onConflict: 'key' });

    if (error) {
      console.error("Supabase UPSERT Error:", error);
      throw error;
    }
    return { success: true };
  } catch (error: any) {
    console.error("Error updating site content:", error.message);
    return { error: error.message };
  }
}

export async function changePassword(formData: FormData) {
  try {
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      return { error: "New passwords do not match" };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!token) return { error: "Not authenticated" };

    const userId = await verifyToken(token);
    if (!userId) return { error: "Invalid session" };

    const { data: user, error: fetchError } = await supabaseAdmin
      .from('members')
      .select('password')
      .eq('id', userId)
      .single();

    if (fetchError || !user) return { error: "User not found" };

    const isCorrect = await comparePassword(currentPassword, user.password);
    if (!isCorrect) return { error: "Incorrect current password" };

    const hashed = await hashPassword(newPassword);
    const { error: updateError } = await supabaseAdmin
      .from('members')
      .update({ password: hashed })
      .eq('id', userId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (err: any) {
    console.error("Change password error:", err.message);
    return { error: err.message };
  }
}
