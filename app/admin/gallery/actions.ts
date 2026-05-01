"use server";

import { supabaseAdmin, deleteStorageFile } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createGalleryEventAction(eventData: any) {
  try {
    const { data, error } = await supabaseAdmin
      .from('gallery_events')
      .insert([eventData])
      .select()
      .single();

    if (error) throw error;
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function addGalleryImagesAction(images: any[]) {
  try {
    const { data, error } = await supabaseAdmin
      .from('gallery_images')
      .insert(images)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteGalleryEventAction(id: number) {
  try {
    // 1. Fetch all media for cleanup
    const { data: event } = await supabaseAdmin.from('gallery_events').select('cover_image').eq('id', id).single();
    const { data: gallery } = await supabaseAdmin.from('gallery_images').select('image_url').eq('event_id', id);

    // 2. Delete database record
    const { error } = await supabaseAdmin
      .from('gallery_events')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // 3. Purge Storage
    if (event?.cover_image) await deleteStorageFile(event.cover_image);
    if (gallery) {
        for (const img of gallery) {
            await deleteStorageFile(img.image_url);
        }
    }

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteGalleryImageAction(id: number) {
  try {
    // 1. Fetch URL before delete
    const { data: img } = await supabaseAdmin.from('gallery_images').select('image_url').eq('id', id).single();

    // 2. Delete record
    const { error } = await supabaseAdmin
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // 3. Purge Storage
    if (img?.image_url) await deleteStorageFile(img.image_url);

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
