/**
 * Blog Grid Section Definition
 */

import { Newspaper } from 'lucide-react';
import BlogGridSection from '@/components/landing/BlogGridSection';
import BlogGridSettingsContent from '@/components/admin/sections/BlogGridSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultBlogGridProps = {
  badge: 'BLOG',
  title: 'Latest Articles',
  subtitle: 'Stay updated with our latest news, tutorials, and insights.',
  articles: [
    { title: 'Getting Started with Web Hosting', excerpt: 'Learn the basics of web hosting and how to choose the right plan for your needs.', image: '/placeholder.svg', category: 'Tutorial', readTime: '5 min', author: 'John Smith' },
    { title: 'Speed Optimization Tips', excerpt: 'Discover proven techniques to make your website load faster and improve user experience.', image: '/placeholder.svg', category: 'Performance', readTime: '8 min', author: 'Sarah Johnson' },
    { title: 'Security Best Practices', excerpt: 'Essential security measures every website owner should implement to stay protected.', image: '/placeholder.svg', category: 'Security', readTime: '6 min', author: 'Mike Chen' },
  ],
};

registerSection({
  type: 'blog-grid',
  displayName: 'Blog Grid',
  icon: Newspaper,
  category: 'content',
  component: BlogGridSection,
  settingsComponent: createSettingsWrapper(BlogGridSettingsContent),
  defaultProps: defaultBlogGridProps,
  description: 'Blog posts grid layout',
  pageGroup: 'General',
  pageGroupOrder: 16,
  translatableProps: ['badge', 'title', 'subtitle', 'articles.*.title', 'articles.*.excerpt'],
  usesDataWrapper: true,
});
