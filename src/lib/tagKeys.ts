export const CacheTagKeys = {
  institution: (id: string) => ['institution', id],
  institutionPlans: (id: string) => ['institution-plans', id],
} as const;