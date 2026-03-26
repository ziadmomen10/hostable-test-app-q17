import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOHeadProps {
  title: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: object;
}

/**
 * SEOHead - Declarative SEO meta tag management using react-helmet-async
 * 
 * This component provides a clean, React-way of managing document head tags.
 * It automatically handles:
 * - Page title
 * - Meta description and keywords
 * - Open Graph tags for social sharing
 * - Twitter Card tags
 * - Canonical URLs
 * - Robot directives (noindex, nofollow)
 * - JSON-LD structured data
 * 
 * Benefits:
 * - Server-side rendering ready (for future prerendering integration)
 * - Automatic cleanup when components unmount
 * - Type-safe props
 * - No direct DOM manipulation
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  canonicalUrl,
  noIndex = false,
  noFollow = false,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  structuredData,
}) => {
  // Build robots content
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow',
  ].join(', ');

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsContent} />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={ogTitle || title} />
      {(ogDescription || description) && (
        <meta property="og:description" content={ogDescription || description} />
      )}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle || ogTitle || title} />
      {(twitterDescription || ogDescription || description) && (
        <meta
          name="twitter:description"
          content={twitterDescription || ogDescription || description}
        />
      )}
      {(twitterImage || ogImage) && (
        <meta name="twitter:image" content={twitterImage || ogImage} />
      )}

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
