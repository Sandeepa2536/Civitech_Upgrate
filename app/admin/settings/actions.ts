"use server";

import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyToken, comparePassword, hashPassword } from "@/lib/auth";

export async function changePassword(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match" };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    return { error: "Not authenticated" };
  }

  const userId = await verifyToken(token);
  if (!userId) {
    return { error: "Invalid session" };
  }

  try {
    // Check current password
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('members')
      .select('password')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return { error: "User not found" };
    }

    const isCorrect = await comparePassword(currentPassword, user.password || '');
    if (!isCorrect) {
      return { error: "Incorrect current password" };
    }

    // Hash and update password
    const hashed = await hashPassword(newPassword);
    const { error: updateError } = await supabaseAdmin
      .from('members')
      .update({ password: hashed })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    return { success: true };
  } catch (err) {
    console.error("Change password error:", err);
    return { error: "Failed to update password. Please try again." };
  }
}

export async function updateSiteContentAction(key: string, value: string) {
  try {
    const { error } = await supabaseAdmin
      .from('site_content')
      .upsert({ key, value }, { onConflict: 'key' });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error updating site content:", error.message);
    return { error: error.message };
  }
}
