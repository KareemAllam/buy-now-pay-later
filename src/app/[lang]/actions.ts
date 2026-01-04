'use server';

import { redirect } from "next/navigation";

export async function signOutAction(lang: string) {
  // Sign out will be handled client-side via NextAuth
  // This action just redirects
  redirect(`/${lang}`);
}

