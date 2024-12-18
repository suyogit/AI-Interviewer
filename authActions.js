"use server";

import { signIn, signOut,auth } from "@/auth";


export async function getServerSession() {
  return await auth();
}
export const handleSignIn = async () => {
  await signIn("github");
};

export const handleSignOut = async () => {
  await signOut({ redirectTo: "/" });
};
