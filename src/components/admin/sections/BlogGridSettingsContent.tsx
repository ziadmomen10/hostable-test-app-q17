/**
 * Blog Grid Settings Content
 * 
 * Content-only settings. Layout and Style are handled by the main SettingsPanel.
 */

import React, { useCallback } from 'react';
import { BlogGridSectionData, BlogArticle } from '@/types/newSectionTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';
import { SectionHeaderFields, ItemListEditor } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface BlogGridSettingsContentProps {
  data: BlogGridSectionData;
  onChange: (data: BlogGridSectionData) => void;
}

const BlogGridSettingsContent: React.FC<BlogGridSettingsContentProps> = ({
  data,
  onChange,
}) => {
  const { updateFields, updateArray } = useDataChangeHandlers(data, onChange);

  const handleArticlesChange = useCallback((articles: BlogArticle[]) => {
    updateArray('articles', articles);
  }, [updateArray]);

  const createNewArticle = useCallback((): BlogArticle => ({
    title: 'New Article',
    excerpt: 'Article excerpt goes here...',
    image: '/placeholder.svg',
    category: 'General',
    readTime: '5 min read',
  }), []);

  return (
    <div className="space-y-6 p-3">
      <SectionHeaderFields
        badge={data.badge || ''}
        title={data.title}
        subtitle={data.subtitle || ''}
        onBadgeChange={(badge) => updateFields({ badge })}
        onTitleChange={(title) => updateFields({ title })}
        onSubtitleChange={(subtitle) => updateFields({ subtitle })}
      />

      <div className="border-t pt-4">
        <h4 className="font-medium text-sm mb-3">Articles</h4>
        <ItemListEditor
          items={data.articles}
          onItemsChange={handleArticlesChange}
          createNewItem={createNewArticle}
          getItemTitle={(article) => article.title || 'Untitled Article'}
          getItemSubtitle={(article) => article.category}
          getItemIcon={() => <FileText className="h-3 w-3 text-muted-foreground" />}
          addItemLabel="Add Article"
          emptyMessage="No articles. Add one to get started."
          emptyStateIcon={<FileText className="h-10 w-10 text-muted-foreground/50 mb-2" />}
          minItems={1}
          maxItems={12}
          showDuplicateButton
          confirmDelete
          renderItem={(article, index, onUpdate) => (
            <div className="space-y-3 pt-2">
              <div>
                <Label className="text-[10px]">Title</Label>
                <Input
                  value={article.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  className="h-7 text-xs"
                />
              </div>
              <div>
                <Label className="text-[10px]">Excerpt</Label>
                <Textarea
                  value={article.excerpt}
                  onChange={(e) => onUpdate({ excerpt: e.target.value })}
                  className="text-xs min-h-[50px] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px]">Category</Label>
                  <Input
                    value={article.category}
                    onChange={(e) => onUpdate({ category: e.target.value })}
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-[10px]">Read Time</Label>
                  <Input
                    value={article.readTime}
                    onChange={(e) => onUpdate({ readTime: e.target.value })}
                    className="h-7 text-xs"
                  />
                </div>
              </div>
              <div>
                <Label className="text-[10px]">Image URL</Label>
                <Input
                  value={article.image}
                  onChange={(e) => onUpdate({ image: e.target.value })}
                  className="h-7 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px]">Link URL</Label>
                  <Input
                    value={article.link || ''}
                    onChange={(e) => onUpdate({ link: e.target.value })}
                    placeholder="/blog/article-slug"
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-[10px]">Date</Label>
                  <Input
                    value={article.date || ''}
                    onChange={(e) => onUpdate({ date: e.target.value })}
                    placeholder="January 1, 2024"
                    className="h-7 text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default BlogGridSettingsContent;
