import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Code, BookOpen, Layers, Palette, Globe, HelpCircle, Cpu, FileCode, Zap, Server, GitBranch, RefreshCw } from 'lucide-react';
import AdminSectionHeader from '@/components/admin/AdminSectionHeader';
import { 
  DocSearch, 
  DocCard, 
  QuickLinkCard, 
  DocSidebar, 
  DocBreadcrumbs, 
  DocContent, 
  DocNavigation, 
  DocTableOfContents, 
  DocRecentlyUpdated,
  DocArticleHeader,
  DocArticleFooter 
} from '@/components/admin/documentation';
import { documentationCategories, getArticle, getAdjacentArticles } from '@/content/documentation';

// Helper to estimate reading time (words per minute)
const estimateReadingTime = (content: string): number => {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

// Helper to check if article is new (updated within last 30 days)
const isRecentlyUpdated = (lastUpdated: string): boolean => {
  const updated = new Date(lastUpdated);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return updated > thirtyDaysAgo;
};

// Helper to find related articles
const getRelatedArticles = (currentCategory: string, currentSlug: string, tags: string[]) => {
  const related: { title: string; href: string; category?: string }[] = [];
  
  documentationCategories.forEach(cat => {
    cat.articles.forEach(art => {
      if (cat.id === currentCategory && art.slug === currentSlug) return;
      if (related.length >= 3) return;
      
      // Simple relevance: same category or matching tags
      if (cat.id === currentCategory || tags.some(tag => art.title.toLowerCase().includes(tag))) {
        related.push({
          title: art.title,
          href: `/a93jf02kd92ms71x8qp4/documentation/${cat.id}/${art.slug}`,
          category: cat.title,
        });
      }
    });
  });
  
  return related;
};

const AdminDocumentationPage: React.FC = () => {
  const { category, article } = useParams<{ category?: string; article?: string }>();
  
  // Manage sidebar collapsed state at page level for margin calculation
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('doc-sidebar-collapsed');
    return saved === 'true';
  });
  
  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('doc-sidebar-collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // If viewing a specific article
  if (category && article) {
    const articleData = getArticle(category, article);
    const { prev, next } = getAdjacentArticles(category, article);
    const categoryData = documentationCategories.find(c => c.id === category);

    if (!articleData) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
          <p className="text-muted-foreground">The requested documentation article could not be found.</p>
        </div>
      );
    }

    const readingTime = estimateReadingTime(articleData.content);
    const relatedArticles = getRelatedArticles(category, article, articleData.tags);
    const isNew = isRecentlyUpdated(articleData.lastUpdated);

    return (
      <div className="flex -mx-6 -mt-6">
        <DocSidebar 
          className="hidden lg:block" 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className={`flex-1 p-8 lg:p-10 min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-72'}`}>
          <DocBreadcrumbs
            items={[
              { label: categoryData?.title || category, href: `/a93jf02kd92ms71x8qp4/documentation/${category}` },
              { label: articleData.title },
            ]}
            className="mb-6"
          />
          
          <div className="flex gap-10">
            <article className="flex-1 min-w-0 max-w-[768px]">
              {/* Enhanced Article Header */}
              <DocArticleHeader
                title={articleData.title}
                description={articleData.description}
                category={categoryData?.title}
                categoryHref={`/a93jf02kd92ms71x8qp4/documentation/${category}`}
                lastUpdated={articleData.lastUpdated}
                readingTime={readingTime}
                tags={articleData.tags}
                badges={isNew ? [{ type: 'new' }] : []}
                className="mb-10"
              />
              
              <DocContent content={articleData.content} />
              
              {/* Enhanced Article Footer */}
              <DocArticleFooter
                lastUpdated={articleData.lastUpdated}
                tags={articleData.tags}
                relatedArticles={relatedArticles}
                className="mt-16"
              />
              
              <DocNavigation prev={prev} next={next} />
            </article>
            
            {/* Table of Contents with Progress */}
            <DocTableOfContents 
              content={articleData.content}
              className="hidden xl:block w-64 flex-shrink-0"
            />
          </div>
        </main>
      </div>
    );
  }

  // If viewing a category index
  if (category) {
    const categoryData = documentationCategories.find(c => c.id === category);
    
    if (!categoryData) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Category Not Found</h2>
          <p className="text-muted-foreground">The requested documentation category could not be found.</p>
        </div>
      );
    }

    return (
      <div className="flex -mx-6 -mt-6">
        <DocSidebar 
          className="hidden lg:block" 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className={`flex-1 p-8 lg:p-10 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-72'}`}>
          <DocBreadcrumbs
            items={[
              { label: categoryData.title },
            ]}
            className="mb-8"
          />
          
          <div className="max-w-[768px]">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{categoryData.title}</h1>
            <p className="text-lg md:text-xl text-muted-foreground/85 mb-10 leading-relaxed">{categoryData.description}</p>
            
            <div className="space-y-4">
              {categoryData.articles.map((article) => (
                <QuickLinkCard
                  key={article.slug}
                  title={article.title}
                  to={`/a93jf02kd92ms71x8qp4/documentation/${category}/${article.slug}`}
                  icon={BookOpen}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Documentation home
  return (
    <div className="space-y-8">
      <AdminSectionHeader
        title="Documentation"
        subtitle="Learn how to use and extend the page builder"
      />

      {/* Search */}
      <DocSearch className="max-w-2xl mx-auto" autoFocus />

      {/* Main Categories */}
      <div className="grid md:grid-cols-3 gap-6">
        <DocCard
          title="User Guide"
          description="Learn how to use the page builder effectively. Create and customize pages, add sections, and publish your content."
          icon={User}
          to="/a93jf02kd92ms71x8qp4/documentation/user"
          articleCount={documentationCategories.find(c => c.id === 'user')?.articles.length}
          variant="featured"
        />
        <DocCard
          title="Developer Guide"
          description="Extend and customize the page builder. Create custom sections, integrate with APIs, and follow best practices."
          icon={Code}
          to="/a93jf02kd92ms71x8qp4/documentation/developer"
          articleCount={documentationCategories.find(c => c.id === 'developer')?.articles.length}
          variant="featured"
        />
        <DocCard
          title="DevOps & Infrastructure"
          description="CI/CD pipelines, environment sync, database migrations, edge function deployment, and server management."
          icon={Server}
          to="/a93jf02kd92ms71x8qp4/documentation/devops"
          articleCount={documentationCategories.find(c => c.id === 'devops')?.articles.length}
          variant="featured"
        />
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-sm text-muted-foreground">Quick Links</span>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickLinkCard
          title="Getting Started"
          to="/a93jf02kd92ms71x8qp4/documentation/user/getting-started"
          icon={BookOpen}
        />
        <QuickLinkCard
          title="Working with Sections"
          to="/a93jf02kd92ms71x8qp4/documentation/user/sections"
          icon={Layers}
        />
        <QuickLinkCard
          title="Styling Guide"
          to="/a93jf02kd92ms71x8qp4/documentation/user/styling"
          icon={Palette}
        />
        <QuickLinkCard
          title="Publishing"
          to="/a93jf02kd92ms71x8qp4/documentation/user/publishing"
          icon={Globe}
        />
        <QuickLinkCard
          title="FAQ"
          to="/a93jf02kd92ms71x8qp4/documentation/user/faq"
          icon={HelpCircle}
        />
        <QuickLinkCard
          title="Architecture"
          to="/a93jf02kd92ms71x8qp4/documentation/developer/architecture"
          icon={Cpu}
        />
        <QuickLinkCard
          title="Creating Sections"
          to="/a93jf02kd92ms71x8qp4/documentation/developer/sections"
          icon={FileCode}
        />
        <QuickLinkCard
          title="API Reference"
          to="/a93jf02kd92ms71x8qp4/documentation/developer/api"
          icon={Zap}
        />
        <QuickLinkCard
          title="Infrastructure"
          to="/a93jf02kd92ms71x8qp4/documentation/devops/infrastructure"
          icon={Server}
        />
        <QuickLinkCard
          title="CI/CD Pipeline"
          to="/a93jf02kd92ms71x8qp4/documentation/devops/cicd-pipeline"
          icon={GitBranch}
        />
        <QuickLinkCard
          title="Environment Sync"
          to="/a93jf02kd92ms71x8qp4/documentation/devops/environment-sync"
          icon={RefreshCw}
        />
        <QuickLinkCard
          title="Secrets Management"
          to="/a93jf02kd92ms71x8qp4/documentation/devops/secrets-management"
          icon={Zap}
        />
      </div>

      {/* Recently Updated Section */}
      <DocRecentlyUpdated className="pt-2" />
    </div>
  );
};

export default AdminDocumentationPage;
