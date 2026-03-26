/**
 * Blog Grid Section Component
 * DnD support is provided automatically via SectionDndProvider + useArrayItems
 */

import React from 'react';
import { BlogGridSectionData, BlogArticle } from '@/types/newSectionTypes';
import { SortableItem } from '@/components/editor/SortableItem';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { useArrayItems } from '@/hooks/useArrayItems';
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';
import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import type { SectionStyleProps } from '@/types/elementSettings';
import { getGridColsClass, getGapClass } from '@/lib/gridUtils';
import type { BaseLayoutProps } from '@/types/baseSectionTypes';

interface BlogGridSectionProps {
  data?: BlogGridSectionData;
  sectionId?: string;
  isEditing?: boolean;
  styleOverrides?: SectionStyleProps;
  layoutProps?: BaseLayoutProps;
}

const defaultArticles: BlogArticle[] = [
  {
    title: 'Getting Started with Web Hosting',
    excerpt: 'Learn the basics of web hosting and how to choose the right plan for your needs.',
    image: '/placeholder.svg',
    category: 'Tutorial',
    readTime: '5 min',
    date: 'Jan 15, 2024',
    link: '#',
  },
  {
    title: 'Top 10 Security Tips for Your Website',
    excerpt: 'Protect your website from common threats with these essential security practices.',
    image: '/placeholder.svg',
    category: 'Security',
    readTime: '7 min',
    date: 'Jan 12, 2024',
    link: '#',
  },
  {
    title: 'How to Optimize Your Website Speed',
    excerpt: 'Discover proven techniques to make your website load faster and improve user experience.',
    image: '/placeholder.svg',
    category: 'Performance',
    readTime: '6 min',
    date: 'Jan 10, 2024',
    link: '#',
  },
];

const defaultData: BlogGridSectionData = {
  badge: 'BLOG',
  title: 'Latest Articles',
  subtitle: 'Stay updated with our latest news and tutorials',
  articles: defaultArticles,
};

const BlogGridSection: React.FC<BlogGridSectionProps> = ({ data = defaultData, sectionId, isEditing = false, styleOverrides, layoutProps }) => {
  const articles = data.articles || [];
  
  // Use layoutProps for grid configuration
  const columns = layoutProps?.columns ?? 3;
  const gridColsClass = getGridColsClass(columns, 'md');
  const gapClass = getGapClass(layoutProps?.gap);
  
  // Use centralized DnD hook
  const { getItemProps, SortableWrapper } = useArrayItems('articles', articles);

  return (
    <SectionContainer variant="light" padding="lg" styleOverrides={styleOverrides}>
      <SectionHeader
        sectionId={sectionId}
        badge={data.badge}
        title={data.title || ''}
        subtitle={data.subtitle}
        badgeClassName="text-sm font-semibold uppercase tracking-wider text-primary bg-transparent px-0 py-0"
        subtitleClassName="max-w-2xl"
      />

      <SortableWrapper>
        <div className={`grid ${gridColsClass} ${gapClass}`}>
          {articles.map((article, index) => (
            <SortableItem
              key={`${sectionId}-articles-${index}`}
              {...getItemProps(index)}
              className="h-full"
            >
              <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all h-full">
                <EditableElement
                  sectionId={sectionId}
                  path={`articles.${index}.image`}
                  type="image"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.image || '/placeholder.svg'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </EditableElement>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <EditableInline
                      sectionId={sectionId}
                      path={`articles.${index}.category`}
                      className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary"
                    >
                      <RichTextRenderer content={article.category} />
                    </EditableInline>
                    <EditableInline
                      sectionId={sectionId}
                      path={`articles.${index}.readTime`}
                      className="text-xs text-muted-foreground"
                    >
                      <RichTextRenderer content={article.readTime} />
                    </EditableInline>
                  </div>
                  <EditableElement
                    as="h3"
                    sectionId={sectionId}
                    path={`articles.${index}.title`}
                    className="font-bold text-lg text-card-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2"
                  >
                    <RichTextRenderer content={article.title} />
                  </EditableElement>
                  <EditableElement
                    as="p"
                    sectionId={sectionId}
                    path={`articles.${index}.excerpt`}
                    className="text-muted-foreground text-sm line-clamp-2"
                  >
                    <RichTextRenderer content={article.excerpt} />
                  </EditableElement>
                  {article.date && (
                    <EditableInline
                      sectionId={sectionId}
                      path={`articles.${index}.date`}
                      className="text-xs text-muted-foreground mt-4 block"
                    >
                      <RichTextRenderer content={article.date} />
                    </EditableInline>
                  )}
                </div>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableWrapper>
    </SectionContainer>
  );
};

export default BlogGridSection;
