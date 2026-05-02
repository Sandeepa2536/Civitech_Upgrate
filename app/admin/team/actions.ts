"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function onboardMemberAction(memberData: any, imagePath: string) {
  try {
    console.log("Onboarding member:", memberData.fname, "Role ID:", memberData.job_role_id);
    
    if (!memberData || !memberData.fname) {
      return { error: "Incomplete member data provided." };
    }

    // Safety: ensure numeric IDs
    memberData.job_role_id = memberData.job_role_id ? Number(memberData.job_role_id) : null;
    memberData.status_id = memberData.status_id ? Number(memberData.status_id) : 1;

    if (memberData.job_role_id === 0 || isNaN(memberData.job_role_id)) {
        memberData.job_role_id = null;
    }

    const { data: member, error: memberError } = await supabaseAdmin
      .from('members')
      .insert([memberData])
      .select()
      .single();

    if (memberError) {
        console.error("Member Insert Error:", memberError);
        return { error: memberError.message };
    }

    if (member && imagePath && imagePath.trim() !== "") {
      const { error: profileError } = await supabaseAdmin
        .from('member_profile')
        .insert([{ members_id: member.id, path: imagePath }]);
      if (profileError) console.error("Profile Insert Error:", profileError);
    }

    revalidatePath("/about/team");
    revalidatePath("/admin/team");
    return { success: true };
  } catch (err: any) {
    console.error("Onboard Crash:", err);
    return { error: err.message };
  }
}

export async function updateMemberAction(id: string, memberData: any, imagePath: string | null) {
  try {
    const memberId = Number(id);
    console.log("Updating member ID:", memberId, "Data:", memberData);

    if (isNaN(memberId)) throw new Error("Invalid Member ID (NaN)");

    // Safety: ensure numeric IDs
    memberData.job_role_id = memberData.job_role_id ? Number(memberData.job_role_id) : null;
    memberData.status_id = memberData.status_id ? Number(memberData.status_id) : 1;

    if (memberData.job_role_id === 0 || isNaN(memberData.job_role_id)) {
        memberData.job_role_id = null;
    }

    // 1. Update Member Core Data
    const { error: memberError } = await supabaseAdmin
      .from('members')
      .update(memberData)
      .eq('id', memberId);

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
        .eq('members_id', memberId)
        .maybeSingle();
      
      if (existing) {
        // Update existing profile
        const { error: upError } = await supabaseAdmin
          .from('member_profile')
          .update({ path: imagePath })
          .eq('members_id', memberId);
        if (upError) console.error("Profile update error:", upError);
      } else {
        // Create new profile link
        const { error: inError } = await supabaseAdmin
          .from('member_profile')
          .insert([{ members_id: memberId, path: imagePath }]);
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
