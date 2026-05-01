"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { signToken, comparePassword } from "@/lib/auth";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const { data: member, error } = await supabaseAdmin
      .from('members')
      .select('id, email, password, status_id')
      .eq('email', email.trim())
      .single();

    if (error) {
      console.error("Database error during login:", error.message);
      return { error: "Connection error. Please check your configuration." };
    }

    if (!member || !member.password) {
      console.log("Login failed: Member not found or password missing for", email);
      return { error: "Invalid email or password" };
    }

    const isPasswordCorrect = await comparePassword(password, member.password);
    if (!isPasswordCorrect) {
      console.log("Login failed: Password mismatch for", email);
      return { error: "Invalid email or password" };
    }

    if (member.status_id !== 1) { // Assuming 1 is 'Active'
      return { error: "Account is inactive. Please contact system administrator." };
    }

    // Create a secure signed token
    // Payload is the user ID, expires in 1 hour (3600 seconds)
    const token = await signToken(member.id.toString(), 3600);

    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour
      path: "/",
      sameSite: 'lax'
    });
    
  } catch (err) {
    console.error("Login error:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
  
  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/login");
}
