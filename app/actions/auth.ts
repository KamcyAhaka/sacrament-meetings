'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

/**
 * Authenticates the user with email/password credentials.
 * Rethrows redirection errors to allow Next.js routing to function correctly.
 */
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials. Please verify your email and password.';
        default:
          return 'Something went wrong. Please try again.';
      }
    }
    throw error;
  }
}

/**
 * Signs the current user out and redirects them to the homepage.
 */
export async function handleSignOut() {
  await signOut({ redirectTo: '/' });
}
