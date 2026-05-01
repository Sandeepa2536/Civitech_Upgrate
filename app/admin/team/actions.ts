"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function onboardMemberAction(memberData: any, imagePath: string) {
  try {
    if (!memberData || !memberData.fname) {
      return { error: "Incomplete member data provided." };
    }

    const { data: member, error: memberError } = await supabaseAdmin
      .from('members')
      .insert([memberData])
      .select()
      .single();

    if (memberError) return { error: memberError.message };

    if (member) {
      await supabaseAdmin
        .from('member_profile')
        .insert([{ members_id: member.id, path: imagePath || 'https://via.placeholder.com/150' }]);
    }

    revalidatePath("/about/team");
    revalidatePath("/admin/team");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function updateMemberAction(id: string, memberData: any, imagePath: string | null) {
  try {
    // 1. Update Member Core Data
    const { error: memberError } = await supabaseAdmin
      .from('members')
      .update(memberData)
      .eq('id', id);

    if (memberError) {
      console.error("Supabase Member Update Error:", memberError);
      return { error: memberError.message };
    }

    // 2. Handle Profile Image association
    if (imagePath && imagePath.trim() !== "") {
      // Check for existing profile record
      const { data: existing } = await supabaseAdmin
        .from('member_profile')
        .select('id')
        .eq('members_id', id)
        .maybeSingle();
      
      if (existing) {
        // Update existing profile
        const { error: upError } = await supabaseAdmin
          .from('member_profile')
          .update({ path: imagePath })
          .eq('members_id', id);
        if (upError) console.error("Profile update error:", upError);
      } else {
        // Create new profile link
        const { error: inError } = await supabaseAdmin
          .from('member_profile')
          .insert([{ members_id: id, path: imagePath }]);
        if (inError) console.error("Profile insert error:", inError);
      }
    }

    revalidatePath("/about/team");
    revalidatePath("/admin/team");
    return { success: true };
  } catch (error: any) {
    console.error("Server Action Crash (updateMemberAction):", error);
    return { error: error.message || "Failed to synchronize personnel record." };
  }
}

export async function deleteMemberAction(id: string) {
  try {
    const { error } = await supabaseAdmin.from('members').delete().eq('id', id);
    if (error) throw error;
    revalidatePath("/about/team");
    revalidatePath("/admin/team");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
