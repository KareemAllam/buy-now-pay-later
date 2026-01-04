export const CacheTagKeys = {
  institution: (id: string) => ['institution', id],
  institutionPlans: (id: string) => ['institution-plans', id],

  applications: (userId: string) => ['applications', userId],

  installments: (userId: string) => ['installments', userId],

  plans: (institutionId: string) => ['plans', institutionId],

  payments: (installmentId: string) => ['payments', installmentId],
} as const;