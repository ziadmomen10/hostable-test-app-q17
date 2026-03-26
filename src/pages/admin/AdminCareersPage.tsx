import React, { useState } from 'react';
import { useJobPosts, useDeleteJobPost, useToggleJobPost, type JobPost } from '@/hooks/useJobPosts';
import { useDepartments, useCreateDepartment, useDeleteDepartment } from '@/hooks/useDepartments';
import { useJobApplications } from '@/hooks/useJobApplications';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Pencil, Eye, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import JobPostForm from '@/components/careers/JobPostForm';
import JobApplicationsViewer from '@/components/careers/JobApplicationsViewer';

const AdminCareersPage: React.FC = () => {
  const { data: jobPosts = [], isLoading } = useJobPosts();
  const { data: departments = [] } = useDepartments();
  const deleteJobPost = useDeleteJobPost();
  const toggleJobPost = useToggleJobPost();
  const createDepartment = useCreateDepartment();
  const deleteDepartment = useDeleteDepartment();

  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<JobPost | null>(null);
  const [viewingApplications, setViewingApplications] = useState<string | null>(null);
  const [newDeptName, setNewDeptName] = useState('');

  const handleEdit = (post: JobPost) => {
    setEditingPost(post);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditingPost(null);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job post?')) return;
    try {
      await deleteJobPost.mutateAsync(id);
      toast.success('Job post deleted');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await toggleJobPost.mutateAsync({ id, is_active: !current });
      toast.success(!current ? 'Job post activated' : 'Job post deactivated');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleAddDept = async () => {
    if (!newDeptName.trim()) return;
    try {
      await createDepartment.mutateAsync({ name: newDeptName.trim() });
      setNewDeptName('');
      toast.success('Department created');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteDept = async (id: string) => {
    if (!confirm('Delete this department? All associated job posts will be removed.')) return;
    try {
      await deleteDepartment.mutateAsync(id);
      toast.success('Department deleted');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const locationLabel = (post: JobPost) => {
    if (post.location_type === 'remote') return 'Remote';
    if (post.location_type === 'onsite') return `Onsite${post.location_country ? ` (${post.location_country})` : ''}`;
    return `Hybrid${post.location_country ? ` (${post.location_country})` : ''}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Tabs defaultValue="jobs">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Career Management</h1>
            <p className="text-sm text-muted-foreground">Manage job posts and departments</p>
          </div>
          <TabsList>
            <TabsTrigger value="jobs">Job Posts</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" /> New Job Post
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : jobPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No job posts yet. Create your first one!
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Apply</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.department?.name || '—'}</TableCell>
                      <TableCell>{locationLabel(post)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {post.commitment_type === 'custom' ? post.commitment_custom : post.commitment_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={post.apply_type === 'internal' ? 'default' : 'outline'}>
                          {post.apply_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={post.is_active}
                          onCheckedChange={() => handleToggle(post.id, post.is_active)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {post.apply_type === 'internal' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setViewingApplications(post.id)}
                              title="View Applications"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="flex gap-2 max-w-md">
            <Input
              placeholder="New department name..."
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddDept()}
            />
            <Button onClick={handleAddDept} disabled={!newDeptName.trim()}>
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>

          {departments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No departments yet. Add one above.
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Job Posts</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => {
                    const count = jobPosts.filter((p) => p.department_id === dept.id).length;
                    return (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          {dept.name}
                        </TableCell>
                        <TableCell>{count}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteDept(dept.id)}
                            disabled={count > 0}
                            title={count > 0 ? 'Remove all job posts first' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Job Post Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Job Post' : 'Create Job Post'}</DialogTitle>
          </DialogHeader>
          <JobPostForm
            existingPost={editingPost}
            onSuccess={() => {
              setFormOpen(false);
              setEditingPost(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Applications Viewer Dialog */}
      <Dialog open={!!viewingApplications} onOpenChange={() => setViewingApplications(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Applications</DialogTitle>
          </DialogHeader>
          {viewingApplications && <JobApplicationsViewer jobPostId={viewingApplications} />}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminCareersPage;
