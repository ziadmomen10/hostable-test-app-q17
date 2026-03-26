import React, { useState } from 'react';
import { useSubmitApplication } from '@/hooks/useJobApplications';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { z } from 'zod';

const applicationSchema = z.object({
  full_name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().max(30).optional(),
  cover_letter: z.string().trim().max(5000).optional(),
});

interface JobApplicationFormProps {
  jobPostId: string;
  jobTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ jobPostId, jobTitle, open, onOpenChange }) => {
  const submitApplication = useSubmitApplication();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', cover_letter: '' });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = applicationSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      let resume_url: string | undefined;

      if (resumeFile) {
        const ext = resumeFile.name.split('.').pop();
        const path = `resumes/${jobPostId}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('page-assets')
          .upload(path, resumeFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('page-assets').getPublicUrl(path);
        resume_url = publicUrl;
      }

      await submitApplication.mutateAsync({
        job_post_id: jobPostId,
        full_name: result.data.full_name,
        email: result.data.email,
        phone: result.data.phone || undefined,
        resume_url,
        cover_letter: result.data.cover_letter || undefined,
      });

      toast.success('Application submitted successfully!');
      onOpenChange(false);
      setForm({ full_name: '', email: '', phone: '', cover_letter: '' });
      setResumeFile(null);
    } catch (e: any) {
      toast.error(e.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input value={form.full_name} onChange={(e) => update('full_name', e.target.value)} />
            {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
          </div>
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Resume</Label>
            <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
          </div>
          <div className="space-y-2">
            <Label>Cover Letter</Label>
            <Textarea rows={4} value={form.cover_letter} onChange={(e) => update('cover_letter', e.target.value)} />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationForm;
