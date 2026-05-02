"use server";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function updateDirectorBio(bio: string, email: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) return { error: "Not authenticated" };

    // Find the MD's ID using job_role_id = 2
    const { data: md, error: fetchError } = await supabaseAdmin
      .from('members')
      .select('id')
      .eq('job_role_id', 2)
      .single();

    if (fetchError || !md) return { error: "Managing Director not found" };

    const { error } = await supabaseAdmin
      .from('members')
      .update({ bio, email })
      .eq('id', md.id);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    const error = err as Error;
    console.error("Update director error:", error);
    return { error: error.message || "Failed to update director info" };
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) return null;

    const memberId = await verifyToken(token);
    if (!memberId) return null;

    const { data: member, error } = await supabaseAdmin
      .from('members')
      .select(`
        id,
        fname,
        lname,
        email,
        member_profile(path)
      `)
      .eq('id', memberId)
      .single();

    if (error || !member) return null;

    const memberData = member as unknown as {
      id: string;
      fname: string;
      lname: string;
      email: string;
      member_profile: { path: string }[] | null;
    };

    return {
      id: memberData.id,
      name: `${memberData.fname} ${memberData.lname}`,
      fname: memberData.fname,
      lname: memberData.lname,
      email: memberData.email,
      role: "Administrator",
      image: memberData.member_profile?.[0]?.path || null
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

interface UpdateProfileData {
  fname: string;
  lname: string;
  email: string;
  image_url?: string | null;
}

export async function updateProfile(formData: UpdateProfileData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) return { error: "Not authenticated" };

    const userId = await verifyToken(token);
    if (!userId) return { error: "Invalid session" };

    const { fname, lname, email, image_url } = formData;

    const { error: updateError } = await supabaseAdmin
      .from('members')
      .update({ fname, lname, email })
      .eq('id', userId);

    if (updateError) throw updateError;

    if (image_url) {
      const { data: existingProfile } = await supabaseAdmin
        .from('member_profile')
        .select('id')
        .eq('members_id', userId)
        .single();

      if (existingProfile) {
        await supabaseAdmin
          .from('member_profile')
          .update({ path: image_url })
          .eq('members_id', userId);
      } else {
        await supabaseAdmin
          .from('member_profile')
          .insert([{ members_id: userId, path: image_url }]);
      }
    }

    return { success: true };
  } catch (err) {
    const error = err as Error;
    console.error("Update profile error:", error);
    return { error: error.message || "Failed to update profile" };
  }
}

