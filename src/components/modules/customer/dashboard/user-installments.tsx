'use client';

import { getDictionary, Locale } from "@/app/[lang]/dictionaries";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUserInstallments } from "@/hooks/useUserInstallments";
import { TUserInstallment } from "@/services/installments";
import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/utils/currency";
import Link from "next/link";
import { Eye } from "lucide-react";

export function UserInstallments({ lang }: { lang: Locale }) {
  const { data: installments } = useUserInstallments();
  const dict = getDictionary(lang);

  const columns: ColumnDef<TUserInstallment>[] = [
    {
      header: dict.installments?.institution || "Institution",
      accessorKey: "institution",
      cell: ({ row }) => {
        return <div>{row.original?.institution?.name[lang]}</div>;
      },
    },
    {
      header: dict.installments?.plan || "Plan",
      accessorKey: "plan",
      cell: ({ row }) => {
        return <div>{row.original?.plan?.name[lang]}</div>;
      },
    },
    {
      header: dict.installments?.totalAmount || "Total Amount",
      accessorKey: "total_amount",
      cell: ({ row }) => {
        return <div>{formatCurrency(row.original.total_amount, lang)}</div>;
      },
    },
    {
      header: dict.installments?.paidAmount || "Paid",
      accessorKey: "paid_amount",
      cell: ({ row }) => {
        return <div>{formatCurrency(row.original.paid_amount, lang)}</div>;
      },
    },
    {
      header: dict.installments?.remaining || "Remaining",
      accessorKey: "remaining_balance",
      cell: ({ row }) => {
        return <div>{formatCurrency(row.original.remaining_balance, lang)}</div>;
      },
    },
    {
      header: dict.installments?.progress || "Progress",
      accessorKey: "progress",
      cell: ({ row }) => {
        const progress = row.original.total_amount > 0
          ? (row.original.paid_amount / row.original.total_amount) * 100
          : 0;
        return (
          <div className="w-32">
            <Progress value={progress} className="h-2" />
            <span className="text-xs text-muted-foreground mt-1">{Math.round(progress)}%</span>
          </div>
        );
      },
    },
    {
      header: dict.installments?.status || "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={
              status === 'active'
                ? 'success'
                : status === 'completed'
                  ? 'default'
                  : status === 'cancelled'
                    ? 'error'
                    : 'warning'
            }
          >
            {status === 'approved_awaiting_checkout' ? (dict.installments?.awaitingCheckout || 'Awaiting Checkout') : status}
          </Badge>
        );
      },
    },
    {
      header: '',
      accessorKey: "actions",
      cell: ({ row }) => {
        return (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${lang}/installments/${row.original.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              {dict.installments?.viewDetails || "View Details"}
            </Link>
          </Button>
        );
      },
    },
  ];

  return (
    <section>
      {installments && installments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {dict.installments?.noInstallments || "No installment plans found"}
        </div>
      ) : (
        <DataTable columns={columns} data={installments ?? []} />
      )}
    </section>
  );
}