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

export async function publishVacancyAction(data: {
  job_role_id?: string;
  new_job_title?: string;
  category_id?: string;
  new_category?: string;
  location_id?: string;
  new_location?: string;
  employment_type_id: number;
  experience: string;
  qualifications: string[];
  closing_date: string;
}) {
  try {
    // 1. Handle Category
    let finalCategoryId = data.category_id;
    if (data.new_category?.trim()) {
      const { data: catData, error: catError } = await supabaseAdmin
        .from('role_category')
        .insert([{ category: data.new_category.trim() }])
        .select()
        .single();
      if (catError) throw catError;
      finalCategoryId = catData.id.toString();
    }

    // 2. Handle Location
    let finalLocationId = data.location_id;
    if (data.new_location?.trim()) {
      const { data: locData, error: locError } = await supabaseAdmin
        .from('location')
        .insert([{ location: data.new_location.trim() }])
        .select()
        .single();
      if (locError) throw locError;
      finalLocationId = locData.id.toString();
    }

    // 3. Handle Job Role
    let finalJobRoleId = data.job_role_id;
    if (data.new_job_title?.trim()) {
      const { data: roleData, error: roleError } = await supabaseAdmin
        .from('job_role')
        .insert([{ 
          title: data.new_job_title.trim(), 
          status_id: 1,
          role_category_id: finalCategoryId ? Number(finalCategoryId) : null,
          location_id: finalLocationId ? Number(finalLocationId) : null,
          employment_type_id: data.employment_type_id,
          experience: data.experience
        }])
        .select()
        .single();
      if (roleError) throw roleError;
      finalJobRoleId = roleData.id.toString();
    } else if (finalJobRoleId) {
        // Update experience on existing role if provided
        await supabaseAdmin
            .from('job_role')
            .update({ 
                experience: data.experience,
                location_id: finalLocationId ? Number(finalLocationId) : null,
                role_category_id: finalCategoryId ? Number(finalCategoryId) : null
            })
            .eq('id', finalJobRoleId);
    }

    if (!finalJobRoleId) {
      throw new Error("Job role ID missing.");
    }

    // 4. Create Qualifications entry (Linked to Job Role)
    const { error: qualError } = await supabaseAdmin
      .from('qualifications')
      .insert([{
        job_role_id: Number(finalJobRoleId),
        experience: data.experience || "Not specified",
        qualification_1: data.qualifications[0],
        qualification_2: data.qualifications[1] || null,
        qualification_3: data.qualifications[2] || null,
        qualification_4: data.qualifications[3] || null,
        status_id: 1
      }]);

    if (qualError) throw qualError;

    // 5. Create Vacancy
    const { error: vacancyError } = await supabaseAdmin
      .from('vacancies')
      .insert([{
        job_role_id: Number(finalJobRoleId),
        open_date: new Date().toISOString(),
        closing_date: data.closing_date, 
        status_id: 1
      }]);

    if (vacancyError) throw vacancyError;

    revalidatePath('/careers');
    revalidatePath('/admin/careers');
    
    return { success: true };
  } catch (err: any) {
    console.error("Publish Vacancy Error:", err.message);
    return { error: err.message };
  }
}

export async function updateVacancyAction(id: number, data: {
  job_role_id?: string;
  category_id?: string;
  location_id?: string;
  employment_type_id: number;
  experience: string;
  qualifications: string[];
  closing_date: string;
}) {
  try {
    // 1. Update Job Role
    if (data.job_role_id) {
        const { error: roleError } = await supabaseAdmin
            .from('job_role')
            .update({ 
                experience: data.experience,
                location_id: data.location_id ? Number(data.location_id) : null,
                role_category_id: data.category_id ? Number(data.category_id) : null,
                employment_type_id: data.employment_type_id
            })
            .eq('id', Number(data.job_role_id));
        
        if (roleError) throw roleError;

        // 2. Update Qualifications (Linked to Job Role)
        await supabaseAdmin
            .from('qualifications')
            .delete()
            .eq('job_role_id', Number(data.job_role_id));

        const { error: qualError } = await supabaseAdmin
            .from('qualifications')
            .insert([{
                job_role_id: Number(data.job_role_id),
                experience: data.experience || "Not specified",
                qualification_1: data.qualifications[0],
                qualification_2: data.qualifications[1] || null,
                qualification_3: data.qualifications[2] || null,
                qualification_4: data.qualifications[3] || null,
                status_id: 1
            }]);

        if (qualError) throw qualError;
    }

    // 3. Update Vacancy
    const { error: vacancyError } = await supabaseAdmin
      .from('vacancies')
      .update({
        closing_date: data.closing_date,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (vacancyError) throw vacancyError;

    revalidatePath('/careers');
    revalidatePath('/admin/careers');
    
    return { success: true };
  } catch (err: any) {
    console.error("Update Vacancy Error:", err.message);
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


