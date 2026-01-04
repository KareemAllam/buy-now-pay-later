'use server';

import { createUser, getUserByEmail } from "@/services/users";
import { UserRole } from "@/types/db-json.types";

export async function signUpAction(
  full_name: string,
  email: string,
  password: string,
  role: UserRole = 'customer'
) {
  try {
    // Validate required fields
    if (!full_name || !email || !password) {
      return {
        success: false,
        error: "All fields are required",
      };
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return {
        success: false,
        error: "Email already registered",
      };
    }

    // Create new user
    const newUser = await createUser({
      full_name,
      email,
      password,
      role,
    });

    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.full_name,
        role: newUser.role,
      },
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: "Failed to create account. Please try again.",
    };
  }
}

