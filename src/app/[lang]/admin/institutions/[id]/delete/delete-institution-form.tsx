'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Locale } from '../../../../dictionaries';
import { deleteInstitutionAction } from '../../actions';
import { Institution } from '@/types/db-json.types';
import { AlertCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function DeleteInstitutionForm({ institution, lang }: { institution: Institution; lang: Locale }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await deleteInstitutionAction(institution.id, lang);
      
      if (!result.success) {
        setError(result.error || 'Failed to delete institution');
        setIsLoading(false);
        return;
      }
      
      // Redirect to admin dashboard
      router.push(`/${lang}/admin/dashboard`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete institution');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md mb-6">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Institution Details</CardTitle>
          <CardDescription>This institution will be permanently deleted</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-medium">Name (English):</span> {institution.name.en}
          </div>
          <div>
            <span className="font-medium">Name (Arabic):</span> {institution.name.ar}
          </div>
          <div>
            <span className="font-medium">Location:</span> {institution.location[lang]}
          </div>
          <div>
            <span className="font-medium">Type:</span> {institution.type}
          </div>
          <div>
            <span className="font-medium">Gender:</span> {institution.gender}
          </div>
          <div>
            <span className="font-medium">Visible:</span> {institution.is_visible ? 'Yes' : 'No'}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive font-medium mb-2">
            Warning: This action cannot be undone.
          </p>
          <p className="text-sm text-muted-foreground">
            All associated data with this institution will be permanently deleted.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="destructive"
            disabled={isLoading}
          >
            {isLoading ? (
              'Deleting...'
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Institution
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${lang}/admin/dashboard`)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

