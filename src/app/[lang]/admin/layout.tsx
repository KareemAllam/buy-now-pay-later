import QueryProvider from "@/providers/query-client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}