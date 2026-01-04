'use client';

import { Locale } from '../../../../app/[lang]/dictionaries';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { InstallmentPlan } from '@/types/db-json.types';
import { formatCurrency } from '@/utils/currency';
import { useAdminAllInstallments } from '@/hooks/useAdminAllInstallments';

export function InstallmentPlansTab({ lang }: { lang: Locale }) {
  const { data: plans = [], isLoading: loading } = useAdminAllInstallments();

  const columns: ColumnDef<InstallmentPlan>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'User ID',
      accessorKey: 'userId',
    },
    {
      header: 'Institution ID',
      accessorKey: 'institutionId',
    },
    {
      header: 'Plan ID',
      accessorKey: 'planId',
    },
    {
      header: 'Total Amount',
      accessorKey: 'total_amount',
      cell: ({ row }) => {
        return <div>{formatCurrency(row.original.total_amount, lang)}</div>;
      },
    },
    {
      header: 'Paid Amount',
      accessorKey: 'paid_amount',
      cell: ({ row }) => {
        return <div>{formatCurrency(row.original.paid_amount, lang)}</div>;
      },
    },
    {
      header: 'Remaining Balance',
      accessorKey: 'remaining_balance',
      cell: ({ row }) => {
        return <div>{formatCurrency(row.original.remaining_balance, lang)}</div>;
      },
    },
    {
      header: 'Installment Count',
      accessorKey: 'installment_count',
    },
    {
      header: 'Status',
      accessorKey: 'status',
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
            {status}
          </Badge>
        );
      },
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      cell: ({ row }) => {
        return <div>{new Date(row.original.created_at).toLocaleString()}</div>;
      },
    },
  ];

  if (loading) {
    return <div>Loading installment plans...</div>;
  }

  return (
    <div>
      <DataTable columns={columns} data={plans} />
    </div>
  );
}

