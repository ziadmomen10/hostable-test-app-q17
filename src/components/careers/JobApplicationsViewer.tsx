import React from 'react';
import { useJobApplications } from '@/hooks/useJobApplications';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const JobApplicationsViewer: React.FC<{ jobPostId: string }> = ({ jobPostId }) => {
  const { data: applications = [], isLoading } = useJobApplications(jobPostId);

  if (isLoading) return <p className="text-muted-foreground text-center py-8">Loading...</p>;

  if (applications.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No applications yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Resume</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app) => (
          <TableRow key={app.id}>
            <TableCell className="font-medium">{app.full_name}</TableCell>
            <TableCell>{app.email}</TableCell>
            <TableCell>{app.phone || '—'}</TableCell>
            <TableCell>
              {app.resume_url ? (
                <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  View
                </a>
              ) : '—'}
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Date(app.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default JobApplicationsViewer;
