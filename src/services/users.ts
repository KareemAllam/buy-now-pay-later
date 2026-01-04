import { User } from "@/types/db-json.types";
import { NetworkError, BackendError } from "@/lib/errors";

const API_URL = process.env.NEXT_PUBLIC_API_JSON_SERVER;

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new BackendError(
        `Failed to fetch user: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    const users: User[] = await response.json();
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Failed to fetch user by email:', error);

    if (error instanceof NetworkError || error instanceof BackendError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError('Unable to connect to the server. Please check your internet connection.');
    }

    throw new NetworkError('Network connection failed. Please check your internet connection.');
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new BackendError(
        `Failed to fetch user: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    const user: User = await response.json();
    return user;
  } catch (error) {
    console.error('Failed to fetch user by ID:', error);

    if (error instanceof NetworkError || error instanceof BackendError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError('Unable to connect to the server. Please check your internet connection.');
    }

    throw new NetworkError('Network connection failed. Please check your internet connection.');
  }
}

export async function createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
  try {
    // Generate ID (simple timestamp-based ID)
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const created_at = new Date().toISOString();

    const newUser: User = {
      ...userData,
      id,
      created_at,
    };

    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new BackendError(
        `Failed to create user: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    const createdUser: User = await response.json();
    return createdUser;
  } catch (error) {
    console.error('Failed to create user:', error);

    if (error instanceof NetworkError || error instanceof BackendError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError('Unable to connect to the server. Please check your internet connection.');
    }

    throw new NetworkError('Network connection failed. Please check your internet connection.');
  }
}

