'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from '../../../../app/[lang]/dictionaries';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Institution } from '@/types/db-json.types';
import { Eye, EyeOff, Edit, Plus } from 'lucide-react';
import { toggleInstitutionVisibilityAction } from '../../../../app/[lang]/admin/dashboard/actions';
import { formatCurrency } from '@/utils/currency';
import { useAdminAllInstitutions } from '@/hooks/useAdminAllInstitutions';
import { useQueryClient } from '@tanstack/react-query';

export function InstitutionsTab({ lang }: { lang: Locale }) {
  const router = useRouter();
  const { data: institutions = [], isLoading: loading } = useAdminAllInstitutions();
  const queryClient = useQueryClient();
  const [toggling, setToggling] = useState<string | null>(null);

  const handleToggleVisibility = async (institutionId: string) => {
    setToggling(institutionId);
    try {
      const result = await toggleInstitutionVisibilityAction(institutionId, lang);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'institutions', 'all'] });
      } else {
        alert(result.error || 'Failed to toggle visibility');
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      alert('Failed to toggle visibility');
    } finally {
      setToggling(null);
    }
  };

  const columns: ColumnDef<Institution>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => {
        return <div>{row.original.name[lang]}</div>;
      },
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: ({ row }) => {
        return <div className="capitalize">{row.original.type}</div>;
      },
    },
    {
      header: 'Location',
      accessorKey: 'location',
      cell: ({ row }) => {
        return <div>{row.original.location[lang]}</div>;
      },
    },
    {
      header: 'Gender',
      accessorKey: 'gender',
      cell: ({ row }) => {
        return <div className="capitalize">{row.original.gender}</div>;
      },
    },
    {
      header: 'Visible',
      accessorKey: 'is_visible',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            {row.original.is_visible ? (
              <span className="text-green-600">Yes</span>
            ) : (
              <span className="text-gray-500">No</span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }) => {
        const institution = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleToggleVisibility(institution.id)}
              disabled={toggling === institution.id}
              title={institution.is_visible ? 'Hide' : 'Show'}
            >
              {institution.is_visible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/${lang}/admin/institutions/${institution.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return <div>Loading institutions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push(`/${lang}/admin/institutions`)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Institution
        </Button>
      </div>
      <DataTable columns={columns} data={institutions} />
    </div>
  );
}

