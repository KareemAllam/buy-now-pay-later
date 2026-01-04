import QueryProvider from "@/providers/query-client";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <QueryProvider>
        {children}
      </QueryProvider>
    </section>
  );
}