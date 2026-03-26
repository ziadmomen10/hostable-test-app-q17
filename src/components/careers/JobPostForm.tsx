import React, { useState } from 'react';
import { useCreateJobPost, useUpdateJobPost, type JobPost, type JobPostInput } from '@/hooks/useJobPosts';
import { useDepartments, useCreateDepartment } from '@/hooks/useDepartments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface JobPostFormProps {
  existingPost?: JobPost | null;
  onSuccess: () => void;
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const JobPostForm: React.FC<JobPostFormProps> = ({ existingPost, onSuccess }) => {
  const { data: departments = [] } = useDepartments();
  const createJobPost = useCreateJobPost();
  const updateJobPost = useUpdateJobPost();
  const createDepartment = useCreateDepartment();

  const [form, setForm] = useState({
    title: existingPost?.title || '',
    slug: existingPost?.slug || '',
    department_id: existingPost?.department_id || '',
    location_type: existingPost?.location_type || 'remote',
    location_country: existingPost?.location_country || '',
    commitment_type: existingPost?.commitment_type || 'full-time',
    commitment_custom: existingPost?.commitment_custom || '',
    about_the_role: existingPost?.about_the_role || '',
    key_responsibilities: existingPost?.key_responsibilities || '',
    requirements: existingPost?.requirements || '',
    nice_to_have: existingPost?.nice_to_have || '',
    what_we_offer: existingPost?.what_we_offer || '',
    apply_type: existingPost?.apply_type || 'internal',
    apply_external_url: existingPost?.apply_external_url || '',
    is_active: existingPost?.is_active ?? true,
  });

  const [newDeptName, setNewDeptName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field: string, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !existingPost) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleAddDept = async () => {
    if (!newDeptName.trim()) return;
    try {
      const dept = await createDepartment.mutateAsync({ name: newDeptName.trim() });
      update('department_id', dept.id);
      setNewDeptName('');
      toast.success('Department created');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.department_id) {
      toast.error('Title, slug, and department are required');
      return;
    }

    setSubmitting(true);
    try {
      const input: JobPostInput = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        department_id: form.department_id,
        location_type: form.location_type,
        location_country: form.location_type !== 'remote' ? form.location_country || null : null,
        commitment_type: form.commitment_type,
        commitment_custom: form.commitment_type === 'custom' ? form.commitment_custom || null : null,
        about_the_role: form.about_the_role,
        key_responsibilities: form.key_responsibilities,
        requirements: form.requirements,
        nice_to_have: form.nice_to_have || null,
        what_we_offer: form.what_we_offer || null,
        apply_type: form.apply_type,
        apply_external_url: form.apply_type === 'external' ? form.apply_external_url || null : null,
        is_active: form.is_active,
      };

      if (existingPost) {
        await updateJobPost.mutateAsync({ id: existingPost.id, ...input });
        toast.success('Job post updated');
      } else {
        await createJobPost.mutateAsync(input);
        toast.success('Job post created');
      }
      onSuccess();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title & Slug */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Title *</Label>
          <Input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Senior Product Designer" />
        </div>
        <div className="space-y-2">
          <Label>Slug *</Label>
          <Input value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="senior-product-designer" />
        </div>
      </div>

      {/* Department */}
      <div className="space-y-2">
        <Label>Department *</Label>
        <div className="flex gap-2">
          <Select value={form.department_id} onValueChange={(v) => update('department_id', v)}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            <Input
              className="w-40"
              placeholder="New dept..."
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddDept}>+</Button>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label>Location</Label>
        <RadioGroup value={form.location_type} onValueChange={(v) => update('location_type', v)} className="flex gap-4">
          <div className="flex items-center gap-2"><RadioGroupItem value="remote" id="loc-remote" /><Label htmlFor="loc-remote">Remote</Label></div>
          <div className="flex items-center gap-2"><RadioGroupItem value="onsite" id="loc-onsite" /><Label htmlFor="loc-onsite">Onsite</Label></div>
          <div className="flex items-center gap-2"><RadioGroupItem value="hybrid" id="loc-hybrid" /><Label htmlFor="loc-hybrid">Hybrid</Label></div>
        </RadioGroup>
        {form.location_type !== 'remote' && (
          <Input className="mt-2" value={form.location_country} onChange={(e) => update('location_country', e.target.value)} placeholder="Country / City" />
        )}
      </div>

      {/* Commitment */}
      <div className="space-y-2">
        <Label>Commitment Type</Label>
        <Select value={form.commitment_type} onValueChange={(v) => update('commitment_type', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="full-time">Full-Time</SelectItem>
            <SelectItem value="part-time">Part-Time</SelectItem>
            <SelectItem value="freelance">Freelance</SelectItem>
            <SelectItem value="contractor">Contractor</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        {form.commitment_type === 'custom' && (
          <Input className="mt-2" value={form.commitment_custom} onChange={(e) => update('commitment_custom', e.target.value)} placeholder="e.g. Internship" />
        )}
      </div>

      <Separator />

      {/* Description Sections */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>About the Role</Label>
          <Textarea rows={4} value={form.about_the_role} onChange={(e) => update('about_the_role', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Key Responsibilities</Label>
          <Textarea rows={4} value={form.key_responsibilities} onChange={(e) => update('key_responsibilities', e.target.value)} placeholder="One per line" />
        </div>
        <div className="space-y-2">
          <Label>Requirements</Label>
          <Textarea rows={4} value={form.requirements} onChange={(e) => update('requirements', e.target.value)} placeholder="One per line" />
        </div>
        <div className="space-y-2">
          <Label>Nice to Have</Label>
          <Textarea rows={3} value={form.nice_to_have} onChange={(e) => update('nice_to_have', e.target.value)} placeholder="One per line (optional)" />
        </div>
        <div className="space-y-2">
          <Label>What We Offer</Label>
          <Textarea rows={3} value={form.what_we_offer} onChange={(e) => update('what_we_offer', e.target.value)} placeholder="One per line (optional)" />
        </div>
      </div>

      <Separator />

      {/* Apply Type */}
      <div className="space-y-2">
        <Label>Application Method</Label>
        <RadioGroup value={form.apply_type} onValueChange={(v) => update('apply_type', v)} className="flex gap-4">
          <div className="flex items-center gap-2"><RadioGroupItem value="internal" id="apply-internal" /><Label htmlFor="apply-internal">Internal Form</Label></div>
          <div className="flex items-center gap-2"><RadioGroupItem value="external" id="apply-external" /><Label htmlFor="apply-external">External URL</Label></div>
        </RadioGroup>
        {form.apply_type === 'external' && (
          <Input className="mt-2" value={form.apply_external_url} onChange={(e) => update('apply_external_url', e.target.value)} placeholder="https://ats.example.com/apply/..." />
        )}
      </div>

      {/* Active */}
      <div className="flex items-center gap-3">
        <Switch checked={form.is_active} onCheckedChange={(v) => update('is_active', v)} />
        <Label>Active (visible on website)</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : existingPost ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default JobPostForm;
