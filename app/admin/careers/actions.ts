"use server";

import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getApplications() {
  try {
    const { data, error } = await supabaseAdmin
      .from('application')
      .select('*, job_role(title)')
      .order('applied_at', { ascending: false });

    if (error) throw error;
    return { data };
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error fetching applications:', error.message);
    return { error: error.message };
  }
}

export async function deleteApplication(id: number) {
  try {
    const { error } = await supabaseAdmin
      .from('application')
      .delete()
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/careers');
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error deleting application:', error.message);
    return { error: error.message };
  }
}

export async function publishVacancyAction(data: any) {
  try {
    console.log("Publishing vacancy with data:", data);
    
    // 1. Handle Category, Location & Job Role Logic
    let finalJobRoleId: number | undefined = (data.job_role_id && data.job_role_id !== "") ? Number(data.job_role_id) : undefined;
    let finalCategoryId: number | undefined = (data.category_id && data.category_id !== "") ? Number(data.category_id) : undefined;
    let finalLocationId: number | undefined = (data.location_id && data.location_id !== "") ? Number(data.location_id) : undefined;

    console.log("Initial IDs - Role:", finalJobRoleId, "Cat:", finalCategoryId, "Loc:", finalLocationId);

    if (data.new_category) {
        console.log("Creating new category:", data.new_category);
        const { data: newCat, error: catErr } = await supabaseAdmin.from('role_category').insert([{ 
            category: data.new_category,
            status_id: 1 // Explicitly setting status to Active
        }]).select().single();
        if (catErr) { console.error("Category insert error:", catErr); throw catErr; }
        finalCategoryId = newCat.id;
    }

    if (data.new_location) {
        console.log("Creating new location:", data.new_location);
        const { data: newLoc, error: locErr } = await supabaseAdmin.from('location').insert([{ 
            location: data.new_location,
            status_id: 1 // Explicitly setting status to Active
        }]).select().single();
        if (locErr) { console.error("Location insert error:", locErr); throw locErr; }
        finalLocationId = newLoc.id;
    }

    if (data.new_job_title || (!finalJobRoleId && data.new_job_title)) {
        console.log("Creating new job role:", data.new_job_title);
        
        if (!finalCategoryId || isNaN(finalCategoryId)) throw new Error("Missing or invalid Category ID for new job role");
        if (!finalLocationId || isNaN(finalLocationId)) throw new Error("Missing or invalid Location ID for new job role");

        const { data: newRole, error: roleErr } = await supabaseAdmin.from('job_role').insert([{ 
            title: data.new_job_title, 
            role_category_id: finalCategoryId,
            location_id: finalLocationId,
            employment_type_id: Number(data.employment_type_id) || 1,
            status_id: 1
        }]).select().single();
        if (roleErr) { console.error("Job role insert error:", roleErr); throw roleErr; }
        finalJobRoleId = newRole.id;
    }

    console.log("Final Job Role ID for insertion:", finalJobRoleId);

    if (finalJobRoleId === undefined || finalJobRoleId === null || isNaN(finalJobRoleId)) {
        throw new Error(`Job Role ID is missing or invalid: ${finalJobRoleId}`);
    }

    // 2. Insert into job_requirements
    const reqs = data.qualifications.map((req: string) => ({
        job_role_id: finalJobRoleId,
        requirement: req
    }));
    const { error: reqError } = await supabaseAdmin.from('job_requirements').insert(reqs);
    if (reqError) { console.error("Job requirements insert error:", reqError); throw reqError; }

    // 3. Insert into qualifications (Experience)
    const qualPayload: any = {
        job_role_id: finalJobRoleId,
        experience: data.experience || "Not specified",
        status_id: 1
    };
    
    // Attempt with typo column
    qualPayload.ceated_at = new Date();

    const { error: qualError } = await supabaseAdmin.from('qualifications').insert([qualPayload]);
    if (qualError) {
        console.warn("Qualification insert error (retrying with created_at):", qualError.message);
        delete qualPayload.ceated_at;
        qualPayload.created_at = new Date();
        const { error: qualError2 } = await supabaseAdmin.from('qualifications').insert([qualPayload]);
        if (qualError2) {
            console.warn("Qualification insert error (retrying without timestamps):", qualError2.message);
            delete qualPayload.created_at;
            const { error: finalError } = await supabaseAdmin.from('qualifications').insert([qualPayload]);
            if (finalError) throw finalError;
        }
    }

    // 4. Create Vacancy
    const { error: vacancyError } = await supabaseAdmin.from('vacancies').insert([{
        job_role_id: finalJobRoleId,
        open_date: new Date().toISOString(),
        closing_date: data.closing_date, 
        status_id: 1
    }]);
    if (vacancyError) { console.error("Vacancy insert error:", vacancyError); throw vacancyError; }

    revalidatePath('/careers');
    revalidatePath('/admin/careers');
    return { success: true };
  } catch (err: any) {
    console.error("Publish Vacancy Error:", err.message);
    return { error: err.message };
  }
}

export async function updateVacancyAction(id: number, data: any) {
  try {
    const vacancyId = Number(id);
    if (isNaN(vacancyId)) throw new Error("Invalid Vacancy ID (NaN)");

    console.log("Updating vacancy ID:", vacancyId, "with data:", data);

    // 1. Handle Category, Location & Job Role Logic
    let finalJobRoleId: number | undefined = (data.job_role_id && data.job_role_id !== "") ? Number(data.job_role_id) : undefined;
    let finalCategoryId: number | undefined = (data.category_id && data.category_id !== "") ? Number(data.category_id) : undefined;
    let finalLocationId: number | undefined = (data.location_id && data.location_id !== "") ? Number(data.location_id) : undefined;

    console.log("Initial IDs for Update - Role:", finalJobRoleId, "Cat:", finalCategoryId, "Loc:", finalLocationId);

    if (data.new_category) {
        console.log("Creating new category during update:", data.new_category);
        const { data: newCat, error: catErr } = await supabaseAdmin.from('role_category').insert([{ 
            category: data.new_category,
            status_id: 1 
        }]).select().single();
        if (catErr) throw catErr;
        finalCategoryId = newCat.id;
    }

    if (data.new_location) {
        console.log("Creating new location during update:", data.new_location);
        const { data: newLoc, error: locErr } = await supabaseAdmin.from('location').insert([{ 
            location: data.new_location,
            status_id: 1
        }]).select().single();
        if (locErr) throw locErr;
        finalLocationId = newLoc.id;
    }

    if (data.new_job_title || (!finalJobRoleId && data.new_job_title)) {
        console.log("Creating new job role during update:", data.new_job_title);
        
        if (!finalCategoryId || isNaN(finalCategoryId)) throw new Error("Missing or invalid Category ID for new job role");
        if (!finalLocationId || isNaN(finalLocationId)) throw new Error("Missing or invalid Location ID for new job role");

        const { data: newRole, error: roleErr } = await supabaseAdmin.from('job_role').insert([{ 
            title: data.new_job_title, 
            role_category_id: finalCategoryId,
            location_id: finalLocationId,
            employment_type_id: Number(data.employment_type_id) || 1,
            status_id: 1
        }]).select().single();
        if (roleErr) throw roleErr;
        finalJobRoleId = newRole.id;
    }

    console.log("Final Job Role ID for update:", finalJobRoleId);

    if (finalJobRoleId === undefined || finalJobRoleId === null || isNaN(finalJobRoleId)) {
        throw new Error(`Job Role ID is missing or invalid: ${finalJobRoleId}`);
    }

    // 2. Update Job Role info
    const { error: roleUpdateError } = await supabaseAdmin.from('job_role').update({
        employment_type_id: Number(data.employment_type_id) || 1,
        location_id: finalLocationId
    }).eq('id', finalJobRoleId);
    if (roleUpdateError) console.warn("Job role update error (non-critical):", roleUpdateError);

    // 3. Update Requirements
    const { error: delReqError } = await supabaseAdmin.from('job_requirements').delete().eq('job_role_id', finalJobRoleId);
    if (delReqError) throw delReqError;
    
    const { error: insReqError } = await supabaseAdmin.from('job_requirements').insert(data.qualifications.map((req: string) => ({ job_role_id: finalJobRoleId, requirement: req })));
    if (insReqError) throw insReqError;

    // 4. Update Qualifications
    const { error: delQualError } = await supabaseAdmin.from('qualifications').delete().eq('job_role_id', finalJobRoleId);
    if (delQualError) throw delQualError;
    
    const qualPayload: any = { 
        job_role_id: finalJobRoleId, 
        experience: data.experience, 
        status_id: 1
    };
    
    // Attempt with typo column
    qualPayload.ceated_at = new Date();

    const { error: insQualError } = await supabaseAdmin.from('qualifications').insert([qualPayload]);
    if (insQualError) {
        console.warn("Qualification insert error (retrying with created_at):", insQualError.message);
        // Try with correct spelling
        delete qualPayload.ceated_at;
        qualPayload.created_at = new Date();
        
        const { error: insQualError2 } = await supabaseAdmin.from('qualifications').insert([qualPayload]);
        if (insQualError2) {
             console.warn("Qualification insert error (retrying without timestamps):", insQualError2.message);
             // Final fallback: no timestamps
             delete qualPayload.created_at;
             const { error: finalError } = await supabaseAdmin.from('qualifications').insert([qualPayload]);
             if (finalError) throw finalError;
        }
    }

    // 5. Update Vacancy record
    const { error: vacancyError } = await supabaseAdmin
      .from('vacancies')
      .update({ 
        closing_date: data.closing_date,
        job_role_id: finalJobRoleId 
      })
      .eq('id', vacancyId);

    if (vacancyError) throw vacancyError;

    revalidatePath('/careers');
    revalidatePath('/admin/careers');
    return { success: true };
  } catch (err: any) {
    console.error("Update Vacancy Action Error:", err.message);
    return { error: err.message };
  }
}

export async function toggleVacancyStatus(id: number, currentStatus: number) {
  try {
    const newStatus = currentStatus === 1 ? 2 : 1; // Assuming 1=Active, 2=Inactive
    const { error } = await supabaseAdmin
      .from('vacancies')
      .update({ status_id: newStatus })
      .eq('id', id);

    if (error) throw error;
    
    revalidatePath('/careers');
    revalidatePath('/admin/careers');
    return { success: true, newStatus };
  } catch (err: any) {
    console.error('Error toggling vacancy status:', err.message);
    return { error: err.message };
  }
}

export async function deleteVacancy(id: number) {
    try {
      const { error } = await supabaseAdmin
        .from('vacancies')
        .delete()
        .eq('id', id);
  
      if (error) throw error;
      revalidatePath('/careers');
      revalidatePath('/admin/careers');
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error deleting vacancy:', error.message);
      return { error: error.message };
    }
  }


