'use client';

import { useState, useMemo } from 'react';
import { Locale } from '../../../../app/[lang]/dictionaries';
import { DataTable } from '@/components/ui/data-table';
import { TableToolbar } from '@/components/ui/table-toolbar';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { InstallmentPlan } from '@/types/db-json.types';
import { formatCurrency } from '@/utils/currency';
import { useAdminAllInstallments } from '@/hooks/useAdminAllInstallments';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye } from 'lucide-react';

export function InstallmentPlansTab({ lang }: { lang: Locale }) {
  const router = useRouter();
  const { data: plans = [], isLoading: loading } = useAdminAllInstallments();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [institutionFilter, setInstitutionFilter] = useState<string>('all');

  // Get unique institution IDs
  const uniqueInstitutionIds = useMemo(() => {
    const ids = new Set<string>();
    plans.forEach(plan => {
      ids.add(plan.institutionId);
    });
    return Array.from(ids).sort();
  }, [plans]);

  // Filter plans
  const filteredPlans = useMemo(() => {
    let filtered = plans;

    // Search by user ID, institution ID, or plan ID
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(plan =>
        plan.userId.toLowerCase().includes(query) ||
        plan.institutionId.toLowerCase().includes(query) ||
        plan.planId.toLowerCase().includes(query) ||
        plan.id.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(plan => plan.status === statusFilter);
    }

    // Filter by institution
    if (institutionFilter !== 'all') {
      filtered = filtered.filter(plan => plan.institutionId === institutionFilter);
    }

    return filtered;
  }, [plans, searchQuery, statusFilter, institutionFilter]);

  const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'all' || institutionFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setInstitutionFilter('all');
  };

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
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }) => {
        return (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${lang}/admin/installments/${row.original.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
        );
      },
    },
  ];

  if (loading) {
    return <div>Loading installment plans...</div>;
  }

  return (
    <div>
      <TableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by user ID, institution ID, or plan ID..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            options: [
              { value: 'all', label: 'All Statuses' },
              { value: 'approved_awaiting_checkout', label: 'Approved Awaiting Checkout' },
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ],
            onChange: setStatusFilter,
          },
          {
            key: 'institution',
            label: 'Institution ID',
            value: institutionFilter,
            options: [
              { value: 'all', label: 'All Institutions' },
              ...uniqueInstitutionIds.map(id => ({ value: id, label: id })),
            ],
            onChange: setInstitutionFilter,
          },
        ]}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />
      <DataTable columns={columns} data={filteredPlans} />
    </div>
  );
}

