'use server';

import { getUserByEmail } from "@/services/users";

export async function signInAction(
  email: string,
  password: string
) {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Compare plain text passwords
    if (user.password !== password) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
