'use client';

import { useState } from 'react';
import { Locale } from '../../../../app/[lang]/dictionaries';
import { DataTable } from '@/components/ui/data-table';
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
      <DataTable columns={columns} data={applications} />
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

