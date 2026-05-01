"use server";

import { supabaseAdmin } from '@/lib/supabase';

export async function submitApplication(formData: FormData, jobRoleId: number) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const linkedin = (formData.get('linkedin') as string) || "";
    const portfolio = (formData.get('portfolio') as string) || "";
    const cvFile = formData.get('cv') as File;

    // Validation
    if (!name || !email || !phone) {
      return { error: "Name, email, and phone are required" };
    }

    let cvUrl = "";
    
    // 1. Handle File Upload if exists
    if (cvFile && cvFile.size > 0) {
      const fileExt = cvFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `cvs/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('project-images')
        .upload(filePath, cvFile, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error('Supabase Storage Upload Error:', uploadError);
        return { error: "Failed to upload CV. Please try again." };
      }
      
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('project-images')
        .getPublicUrl(filePath);
        
      cvUrl = publicUrl;
    }

    // 2. Insert into database
    const { error: dbError } = await supabaseAdmin
      .from('application')
      .insert([{
        job_role_id: jobRoleId,
        name,
        email,
        mobile: phone,
        linkedin: linkedin,
        github: portfolio,
        cv: cvUrl,
        status_id: 1 // Default status
      }]);

    if (dbError) {
      console.error('Database Insert Error:', dbError);
      return { error: "Failed to save application details." };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error in submitApplication:', error);
    return { error: "An unexpected error occurred during submission." };
  }
}
