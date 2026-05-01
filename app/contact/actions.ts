"use server";

import { supabaseAdmin } from '@/lib/supabase';

export async function submitInquiry(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !phone || !subject || !message) {
    return { error: "All fields are required" };
  }

  if (name.length < 3) {
    return { error: "Name must be at least 3 characters long" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address" };
  }

  const slMobileRegex = /^(?:0|94|\+94)?7(0|1|2|4|5|6|7|8)\d{7}$/;
  if (!slMobileRegex.test(phone.replace(/\s/g, ""))) {
    return { error: "Please enter a valid Sri Lankan mobile number" };
  }

  try {
    const { error } = await supabaseAdmin
      .from('inquiries')
      .insert([
        { name, email, phone, subject, message, status_id: 8 }
      ]);

    if (error) {
      console.error("Supabase error:", error);
      return { error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Inquiry submission error:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
