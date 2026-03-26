import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, FileText, Search } from 'lucide-react';

export interface ContentPageRow {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  seoScore: number | null;
  updatedAt: string;
}

interface ContentStatusTableProps {
  pages: ContentPageRow[];
  loading: boolean;
}

const ContentStatusTable: React.FC<ContentStatusTableProps> = ({ pages, loading }) => {
  const navigate = useNavigate();

  const scoreColor = (score: number | null) => {
    if (score === null) return 'text-muted-foreground';
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-destructive';
  };

  if (loading) {
    return (
      <Card className="dark:bg-white/[0.03] bg-card border-border rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
             <FileText className="h-4 w-4 text-primary" strokeWidth={1.75} /> Recent Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-10 bg-muted animate-pulse rounded" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-white/[0.03] bg-card border-border rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" strokeWidth={1.75} /> Recent Content
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => navigate('/a93jf02kd92ms71x8qp4/pages')}>
            View all <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {pages.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No pages created yet</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate('/a93jf02kd92ms71x8qp4/pages')}>
              Create your first page
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Page</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-center">SEO</TableHead>
                <TableHead className="text-xs text-right">Updated</TableHead>
                <TableHead className="text-xs text-right w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.slice(0, 10).map(page => (
                <TableRow key={page.id} className="cursor-pointer" onClick={() => navigate('/a93jf02kd92ms71x8qp4/pages')}>
                  <TableCell className="font-medium text-sm max-w-[200px] truncate">{page.title}</TableCell>
                  <TableCell>
                    <Badge variant={page.isActive ? 'default' : 'secondary'} className="text-[10px]">
                      {page.isActive ? 'Published' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-center text-sm font-semibold ${scoreColor(page.seoScore)}`}>
                    {page.seoScore !== null ? page.seoScore : '—'}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); navigate('/a93jf02kd92ms71x8qp4/seo'); }}>
                      <Search className="h-4 w-4" strokeWidth={1.75} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentStatusTable;
