'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TUserApplication } from '@/services/applications';

interface RejectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject: (reason: string) => void;
  application: TUserApplication | null;
  processing?: boolean;
}

export function RejectionModal({
  open,
  onOpenChange,
  onReject,
  application,
  processing = false,
}: RejectionModalProps) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!open) {
      setReason('');
    }
  }, [open]);

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    onReject(reason);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Application</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this application.
            {application && (
              <div className="mt-2 text-sm">
                <p>Application ID: {application.id}</p>
                <p>Institution: {application.institution.name.en}</p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Rejection Reason</Label>
            <Textarea
              id="reason"
              placeholder="Enter the reason for rejection..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={processing || !reason.trim()}
          >
            {processing ? 'Rejecting...' : 'Reject Application'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

