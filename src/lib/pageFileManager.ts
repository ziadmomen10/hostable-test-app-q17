// Utility functions for managing dynamic page files
export interface PageFileData {
  pageName: string;
  pageTitle: string;
  pageDescription?: string;
  content?: string;
}

// Generate a React component file for a dynamic page
export const generatePageComponent = (data: PageFileData): string => {
  const componentName = toPascalCase(data.pageName);
  
  return `import React from 'react';
import PageLayout from '@/components/PageLayout';

const ${componentName}: React.FC = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">${data.pageTitle}</h1>
          
          ${data.pageDescription ? `<p className="text-lg text-muted-foreground mb-8">
            ${data.pageDescription}
          </p>` : ''}
          
          {/* Page Content - This will be editable later */}
          <div className="prose prose-lg max-w-none">
            ${data.content || `<div className="bg-muted/50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Welcome to ${data.pageTitle}</h2>
              <p className="text-muted-foreground">
                This is your new page. You'll be able to edit this content through the admin panel.
              </p>
            </div>`}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ${componentName};
`;
};

// Convert string to PascalCase for component names
export const toPascalCase = (str: string): string => {
  return str
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

// Convert page URL to file name
export const getPageFileName = (pageUrl: string): string => {
  // Handle root path
  if (pageUrl === '/' || pageUrl === '') {
    return 'home';
  }
  return pageUrl.replace(/^\//, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
};

// Get the file path for a dynamic page
export const getPageFilePath = (pageUrl: string): string => {
  const fileName = getPageFileName(pageUrl);
  return `src/pages/dynamic/${fileName}.tsx`;
};