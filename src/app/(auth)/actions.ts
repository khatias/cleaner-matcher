// 'use server'

// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'

// import { createClient } from '@/utils/supabase/server'

// export async function login(formData: FormData) {
//   const supabase = await createClient()

//   // type-casting here for convenience
  
    
//   // in practice, you should validate your inputs


//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   }

//   const { error } = await supabase.auth.signInWithPassword(data)

//   if (error) {
//     return error.message
//   }

//   revalidatePath('/', 'layout')
//   redirect('/')
// }

// export async function signup(formData: FormData) {
//   const supabase = await createClient()

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   }

//   const { error } = await supabase.auth.signUp(data)

//   if (error) {
//    return error.message
//   }

//   revalidatePath('/', 'layout')
//   redirect('/')
// }

// app/(auth)/actions.ts
'use server';

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

type AuthState = { ok: boolean; message?: string };

export async function loginAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();

  const email = (formData.get("email") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString();

  // (real validation later)
  if (!email || !password) return { ok: false, message: "Email and password are required." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });


  if (error) return { ok: false, message: "Invalid credentials." };

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signupAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase =  await createClient();

  const email = (formData.get("email") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString();

  if (!email || !password) return { ok: false, message: "Email and password are required." };

  // Redirect new users to your confirm route after email verification mail is sent
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // change to your domain/route
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/confirm`,
    },
  });

  if (error) return { ok: false, message: "Could not create account." };

  // You might show “check your email” instead of redirecting home
  revalidatePath("/", "layout");
  redirect("/"); // or '/' if you prefer
}
 export async function logoutAction() {
   const supabase = await createClient();

   await supabase.auth.signOut();

   revalidatePath("/", "layout");
   redirect("/login");
 }