// src/config/routes.ts
export const protectedRoutes = {
  // Customer routes (require authentication, customer role)
  customer: [
    '/dashboard',
    '/dashboard/applications',
    '/dashboard/plans',
    '/apply',
  ],

  // Admin routes (require authentication, admin role)
  admin: [
    '/admin',
    '/admin/dashboard',
    '/admin/schools',
    '/admin/applications',
    '/admin/plans',
  ],

  // Public routes that don't require auth
  public: [
    '/',
    '/institutions',
    '/signin',
    '/signup',
  ],
} as const;

// Helper function to check if route is protected
export function isProtectedRoute(pathname: string): boolean {
  const allProtected = [...protectedRoutes.customer, ...protectedRoutes.admin];
  return allProtected.some(route => pathname.includes(route));
}

// Helper function to get required role for a route
export function getRequiredRole(pathname: string): 'customer' | 'admin' | null {
  if (protectedRoutes.admin.some(route => pathname.includes(route))) {
    return 'admin';
  }
  if (protectedRoutes.customer.some(route => pathname.includes(route))) {
    return 'customer';
  }
  return null;
}