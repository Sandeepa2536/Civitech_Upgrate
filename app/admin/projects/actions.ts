"use server";

import { supabaseAdmin, deleteStorageFile } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

async function getOrCreateCategory(id: string, newName: string) {
  if (newName.trim()) {
    const { data, error } = await supabaseAdmin
      .from('category')
      .insert([{ category: newName.trim(), status_id: 1 }])
      .select()
      .single();
    if (error) throw error;
    return data.id;
  }
  return id ? Number(id) : null;
}

async function getOrCreateScope(id: string, newName: string) {
  if (newName.trim()) {
    const { data, error } = await supabaseAdmin
      .from('project_scope')
      .insert([{ scope: newName.trim(), status_id: 1 }])
      .select()
      .single();
    if (error) throw error;
    return data.id;
  }
  return id ? Number(id) : null;
}

export async function createProject(formData: any, galleryImages: {path: string}[], videoUrl: string | null) {
  try {
    const categoryId = await getOrCreateCategory(formData.category_id, formData.new_category);
    const scopeId = await getOrCreateScope(formData.project_scope_id, formData.new_project_scope);

    const projectData = {
      title: formData.title,
      location: formData.location,
      category_id: categoryId,
      project_scope_id: scopeId,
      status_id: formData.status_id,
      client_id: formData.client_id,
      cover_image: formData.cover_image,
      started_at: formData.started_at,
      end_at: formData.end_at
    };

    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (projectError) throw projectError;

    if (galleryImages.length > 0) {
      const imagesWithId = galleryImages.map(img => ({ projects_id: project.id, path: img.path }));
      await supabaseAdmin.from('projects_image').insert(imagesWithId);
    }

    if (videoUrl) {
      await supabaseAdmin.from('projects_video').insert([{ projects_id: project.id, url: videoUrl }]);
    }

    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateProject(id: string, formData: any, galleryImages: {path: string}[], videoUrl: string | null) {
  try {
    // 1. Handle Old Media Cleanup if cover changed
    const { data: oldProject } = await supabaseAdmin.from('projects').select('cover_image').eq('id', id).single();
    if (oldProject?.cover_image && oldProject.cover_image !== formData.cover_image) {
        await deleteStorageFile(oldProject.cover_image);
    }

    const categoryId = await getOrCreateCategory(formData.category_id, formData.new_category);
    const scopeId = await getOrCreateScope(formData.project_scope_id, formData.new_project_scope);

    const projectData = {
      title: formData.title,
      location: formData.location,
      category_id: categoryId,
      project_scope_id: scopeId,
      status_id: formData.status_id,
      client_id: formData.client_id,
      cover_image: formData.cover_image,
      started_at: formData.started_at,
      end_at: formData.end_at
    };

    const { error: projectError } = await supabaseAdmin
      .from('projects')
      .update(projectData)
      .eq('id', id);

    if (projectError) throw projectError;

    // 2. Sync Gallery with Cleanup
    const { data: oldImages } = await supabaseAdmin.from('projects_image').select('path').eq('projects_id', id);
    const newPaths = galleryImages.map(img => img.path);
    
    // Delete images that are no longer in the set
    if (oldImages) {
        for (const img of oldImages) {
            if (!newPaths.includes(img.path)) {
                await deleteStorageFile(img.path);
            }
        }
    }

    await supabaseAdmin.from('projects_image').delete().eq('projects_id', id);
    if (galleryImages.length > 0) {
      const imagesWithId = galleryImages.map(img => ({ projects_id: id, path: img.path }));
      await supabaseAdmin.from('projects_image').insert(imagesWithId);
    }

    await supabaseAdmin.from('projects_video').delete().eq('projects_id', id);
    if (videoUrl) {
      await supabaseAdmin.from('projects_video').insert([{ projects_id: id, url: videoUrl }]);
    }

    revalidatePath(`/projects/${id}`);
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteProjectAction(id: string) {
    try {
        // 1. Fetch all media associated with project before deletion
        const { data: project } = await supabaseAdmin.from('projects').select('cover_image').eq('id', id).single();
        const { data: gallery } = await supabaseAdmin.from('projects_image').select('path').eq('projects_id', id);

        // 2. Delete database record (cascading deletes handles related rows, but we need the URLs first)
        const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
        if (error) throw error;

        // 3. Clean up Storage
        if (project?.cover_image) await deleteStorageFile(project.cover_image);
        if (gallery) {
            for (const img of gallery) {
                await deleteStorageFile(img.path);
            }
        }

        revalidatePath("/admin/projects");
        revalidatePath("/projects");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
