'use client';

import { useState, useMemo } from 'react';
import { Locale } from '../../../../app/[lang]/dictionaries';
import { DataTable } from '@/components/ui/data-table';
import { TableToolbar } from '@/components/ui/table-toolbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { TUserApplication } from '@/services/applications';
import { Check, X } from 'lucide-react';
import { approveApplicationAction, rejectApplicationAction } from '@/app/[lang]/admin/dashboard/actions';
import { RejectionModal } from "@/components/modules/admin/dashboard/rejection-modal"
import { formatCurrency } from '@/utils/currency';
import { useAdminAllApplications } from '@/hooks/useAdminAllApplications';
import { useQueryClient } from '@tanstack/react-query';

export function ApplicationsTab({ lang }: { lang: Locale }) {
  const { data: applications = [], isLoading: loading } = useAdminAllApplications();
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<TUserApplication | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [institutionFilter, setInstitutionFilter] = useState<string>('all');

  // Get unique institutions and statuses
  const uniqueInstitutions = useMemo(() => {
    const institutions = new Set<string>();
    applications.forEach(app => {
      institutions.add(app.institution.name[lang]);
    });
    return Array.from(institutions).sort();
  }, [applications, lang]);

  // Filter applications
  const filteredApplications = useMemo(() => {
    let filtered = applications;

    // Search by institution name, plan name, or user ID
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.institution.name[lang].toLowerCase().includes(query) ||
        app.institution.name.en.toLowerCase().includes(query) ||
        app.plan.name[lang].toLowerCase().includes(query) ||
        app.userId.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by institution
    if (institutionFilter !== 'all') {
      filtered = filtered.filter(app => app.institution.name[lang] === institutionFilter);
    }

    return filtered;
  }, [applications, searchQuery, statusFilter, institutionFilter, lang]);

  const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'all' || institutionFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setInstitutionFilter('all');
  };

  const handleApprove = async (applicationId: string) => {
    setProcessing(applicationId);
    try {
      const result = await approveApplicationAction(applicationId, lang);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'applications', 'all'] });
      } else {
        alert(result.error || 'Failed to approve application');
      }
    } catch (error) {
      console.error('Failed to approve application:', error);
      alert('Failed to approve application');
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectClick = (application: TUserApplication) => {
    setSelectedApplication(application);
    setRejectionModalOpen(true);
  };

  const handleReject = async (rejectionReason: string) => {
    if (!selectedApplication) return;

    setProcessing(selectedApplication.id);
    try {
      const result = await rejectApplicationAction(selectedApplication.id, rejectionReason, lang);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'applications', 'all'] });
        setRejectionModalOpen(false);
        setSelectedApplication(null);
      } else {
        alert(result.error || 'Failed to reject application');
      }
    } catch (error) {
      console.error('Failed to reject application:', error);
      alert('Failed to reject application');
    } finally {
      setProcessing(null);
    }
  };

  const columns: ColumnDef<TUserApplication>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'User ID',
      accessorKey: 'userId',
    },
    {
      header: 'Institution',
      accessorKey: 'institution.name',
      cell: ({ row }) => {
        return <div>{row.original.institution.name[lang]}</div>;
      },
    },
    {
      header: 'Plan',
      accessorKey: 'plan.name',
      cell: ({ row }) => {
        return <div>{row.original.plan.name[lang]}</div>;
      },
    },
    {
      header: 'Amount',
      accessorKey: 'tuition_amount',
      cell: ({ row }) => {
        return <div>{formatCurrency(row.original.tuition_amount, lang)}</div>;
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={
              status === 'approved'
                ? 'success'
                : status === 'rejected'
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
      header: 'Rejection Reason',
      accessorKey: 'rejection_reason',
      cell: ({ row }) => {
        return <div className="max-w-xs truncate">{row.original.rejection_reason || '-'}</div>;
      },
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      cell: ({ row }) => {
        const createdAt = row.original.created_at;
        return <div>{createdAt ? new Date(createdAt).toLocaleString() : '-'}</div>;
      },
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }) => {
        const application = row.original;
        if (application.status !== 'pending') {
          return null;
        }
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleApprove(application.id)}
              disabled={processing === application.id}
              className="text-green-600 hover:text-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRejectClick(application)}
              disabled={processing === application.id}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return <div>Loading applications...</div>;
  }

  return (
    <>
      <TableToolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by institution, plan, or user ID..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            options: [
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
            ],
            onChange: setStatusFilter,
          },
          {
            key: 'institution',
            label: 'Institution',
            value: institutionFilter,
            options: [
              { value: 'all', label: 'All Institutions' },
              ...uniqueInstitutions.map(inst => ({ value: inst, label: inst })),
            ],
            onChange: setInstitutionFilter,
          },
        ]}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />
      <DataTable columns={columns} data={filteredApplications} />
      <RejectionModal
        open={rejectionModalOpen}
        onOpenChange={setRejectionModalOpen}
        onReject={handleReject}
        application={selectedApplication}
        processing={processing === selectedApplication?.id}
      />
    </>
  );
}

