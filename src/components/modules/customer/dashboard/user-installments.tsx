'use client';

import { getDictionary, Locale } from "@/app/[lang]/dictionaries";
import { DataTable } from "@/components/ui/data-table";
import { useUserInstallments } from "@/hooks/useUserInstallments";
import { TUserInstallment } from "@/services/installments";
import { ColumnDef } from "@tanstack/react-table";

export function UserInstallments({ lang }: { lang: Locale }) {
  const { data: installments } = useUserInstallments();
  const dict = getDictionary(lang);

  const columns: ColumnDef<TUserInstallment>[] = [
    {
      header: dict.applications.id,
      accessorKey: "id",
    },
    {
      header: dict.applications.institution,
      accessorKey: "institution",
      cell: ({ row }) => {
        return <div>{row.original?.institution?.name[lang]}</div>;
      },
    },
    {
      header: dict.applications.plan,
      accessorKey: "plan",
      cell: ({ row }) => {
        return <div>{row.original?.plan?.name[lang]}</div>;
      },
    },
  ];

  return (
    <section>
      <DataTable columns={columns} data={installments ?? []} />
    </section>
  );
}