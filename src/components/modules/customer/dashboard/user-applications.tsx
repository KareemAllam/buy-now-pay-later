'use client';

import { getDictionary, Locale } from "@/app/[lang]/dictionaries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useUserApplications } from "@/hooks/useUserApplications";
import { TUserApplication } from "@/services/applications";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { WalletIcon } from "lucide-react";

export function UserApplications({ lang }: { lang: Locale }) {
  const { data: applications } = useUserApplications();
  const dict = getDictionary(lang);

  const columns: ColumnDef<TUserApplication>[] = [
    {
      header: dict.applications.id,
      accessorKey: "id",
    },
    {
      header: dict.applications.institution,
      accessorKey: "institution.name.en",
      cell: ({ row }) => {
        return <div>{row.original.institution.name[lang]}</div>;
      },
    },
    {
      header: dict.applications.plan,
      accessorKey: "plan.name.en",
      cell: ({ row }) => {
        return <div>{row.original.plan.name[lang]}</div>;
      },
    },
    {
      header: dict.applications.status,
      accessorKey: "status",
      cell: ({ row }) => {
        return <Badge
          variant={
            row.original.status === 'approved'
              ? 'success'
              : row.original.status === 'rejected'
                ? 'error'
                : 'warning'
          }
        >
          {row.original.status}
        </Badge>;
      },
    },
    {
      header: dict.applications.created_at,
      accessorKey: "created_at",
      cell: ({ row }) => {
        return <div>{new Date(row.original.created_at).toLocaleString()}</div>;
      },
    },
    {
      header: '',
      accessorKey: "actions",
      cell: ({ row }) => {
        if (row.original.status === 'approved') {
          return <div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/${lang}/checkout/${row.original?.id}`}>
                <WalletIcon className="h-4 w-4" />
                Checkout
              </Link>
            </Button>
          </div>;
        }
      },
    }

  ];

  return (
    <section>
      <DataTable columns={columns} data={applications ?? []} />
    </section>
  );
}