import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SectionPattern {
  type: string;
  selector: string;
  content: {
    headings: string[];
    paragraphs: string[];
    buttons: string[];
    images: string[];
  };
  layout: {
    columns?: number;
    alignment?: string;
    hasBackground?: boolean;
  };
  order: number;
}

interface AnalysisResult {
  url: string;
  title: string;
  description: string;
  sections: SectionPattern[];
  colorScheme: {
    primary: string[];
    secondary: string[];
    background: string[];
    text: string[];
  };
  typography: {
    headingFonts: string[];
    bodyFonts: string[];
  };
  metadata: {
    analyzedAt: string;
    pageLoadTime?: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, depth = 1 } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Firecrawl API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing competitor website: ${url}`);

    // Step 1: Scrape the page with Firecrawl
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${firecrawlApiKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ['html', 'markdown'],
        includeTags: ['header', 'nav', 'main', 'section', 'article', 'footer', 'div', 'h1', 'h2', 'h3', 'p', 'button', 'a', 'img'],
        waitFor: 3000,
      }),
    });

    if (!scrapeResponse.ok) {
      const errorText = await scrapeResponse.text();
      console.error('Firecrawl scrape error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to scrape website', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const scrapeData = await scrapeResponse.json();
    console.log('Scrape successful, analyzing content...');

    // Step 2: Extract section patterns from the scraped content
    const sections = extractSectionPatterns(scrapeData.data?.html || '', scrapeData.data?.markdown || '');
    
    // Step 3: Extract color scheme and typography hints from content
    const colorScheme = extractColorScheme(scrapeData.data?.html || '');
    const typography = extractTypography(scrapeData.data?.html || '');

    const result: AnalysisResult = {
      url,
      title: scrapeData.data?.metadata?.title || 'Unknown',
      description: scrapeData.data?.metadata?.description || '',
      sections,
      colorScheme,
      typography,
      metadata: {
        analyzedAt: new Date().toISOString(),
      },
    };

    console.log(`Analysis complete. Found ${sections.length} section patterns.`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error analyzing competitor:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function extractSectionPatterns(html: string, markdown: string): SectionPattern[] {
  const sections: SectionPattern[] = [];
  
  // Common section patterns to detect
  const sectionPatterns = [
    { type: 'hero', keywords: ['hero', 'banner', 'jumbotron', 'masthead', 'intro'], priority: 1 },
    { type: 'features', keywords: ['features', 'benefits', 'services', 'offerings'], priority: 2 },
    { type: 'pricing', keywords: ['pricing', 'plans', 'packages', 'tiers'], priority: 3 },
    { type: 'testimonials', keywords: ['testimonial', 'review', 'customer', 'quote', 'feedback'], priority: 4 },
    { type: 'cta', keywords: ['cta', 'call-to-action', 'get-started', 'signup', 'subscribe'], priority: 5 },
    { type: 'faq', keywords: ['faq', 'questions', 'accordion', 'help'], priority: 6 },
    { type: 'stats', keywords: ['stats', 'numbers', 'counter', 'metrics', 'achievements'], priority: 7 },
    { type: 'team', keywords: ['team', 'about-us', 'people', 'staff', 'members'], priority: 8 },
    { type: 'contact', keywords: ['contact', 'form', 'get-in-touch', 'reach-us'], priority: 9 },
    { type: 'footer', keywords: ['footer', 'bottom', 'copyright'], priority: 10 },
    { type: 'navigation', keywords: ['nav', 'menu', 'header', 'navbar'], priority: 0 },
    { type: 'logo-carousel', keywords: ['partners', 'clients', 'logos', 'trusted', 'brands'], priority: 4 },
    { type: 'comparison', keywords: ['comparison', 'compare', 'vs', 'versus'], priority: 5 },
    { type: 'steps', keywords: ['steps', 'how-it-works', 'process', 'workflow'], priority: 3 },
    { type: 'gallery', keywords: ['gallery', 'portfolio', 'showcase', 'work'], priority: 6 },
  ];

  // Parse markdown to find section-like structures
  const markdownLines = markdown.split('\n');
  let currentSection: Partial<SectionPattern> | null = null;
  let sectionOrder = 0;

  for (let i = 0; i < markdownLines.length; i++) {
    const line = markdownLines[i].trim();
    
    // Detect headings (potential section starts)
    if (line.startsWith('# ') || line.startsWith('## ') || line.startsWith('### ')) {
      if (currentSection && currentSection.type) {
        sections.push(currentSection as SectionPattern);
      }

      const headingText = line.replace(/^#+\s*/, '').toLowerCase();
      let detectedType = 'generic';

      // Match heading to known patterns
      for (const pattern of sectionPatterns) {
        if (pattern.keywords.some(kw => headingText.includes(kw))) {
          detectedType = pattern.type;
          break;
        }
      }

      currentSection = {
        type: detectedType,
        selector: `section-${sectionOrder}`,
        content: {
          headings: [line.replace(/^#+\s*/, '')],
          paragraphs: [],
          buttons: [],
          images: [],
        },
        layout: {
          alignment: 'center',
          hasBackground: false,
        },
        order: sectionOrder++,
      };
    } else if (currentSection) {
      // Add content to current section
      if (line.startsWith('![')) {
        // Image
        const imgMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (imgMatch) {
          currentSection.content!.images!.push(imgMatch[2]);
        }
      } else if (line.startsWith('[') && line.includes('](')) {
        // Link (potential button)
        const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          currentSection.content!.buttons!.push(linkMatch[1]);
        }
      } else if (line.length > 20 && !line.startsWith('-') && !line.startsWith('*')) {
        // Paragraph
        currentSection.content!.paragraphs!.push(line);
      }
    }
  }

  // Add last section
  if (currentSection && currentSection.type) {
    sections.push(currentSection as SectionPattern);
  }

  // If no sections found from markdown, try to infer from HTML structure
  if (sections.length === 0) {
    const htmlLower = html.toLowerCase();
    
    for (const pattern of sectionPatterns) {
      for (const keyword of pattern.keywords) {
        if (htmlLower.includes(`class="${keyword}`) || 
            htmlLower.includes(`class='${keyword}`) ||
            htmlLower.includes(`id="${keyword}`) ||
            htmlLower.includes(`id='${keyword}`) ||
            htmlLower.includes(`data-section="${keyword}`)) {
          sections.push({
            type: pattern.type,
            selector: keyword,
            content: { headings: [], paragraphs: [], buttons: [], images: [] },
            layout: { alignment: 'center' },
            order: pattern.priority,
          });
          break;
        }
      }
    }
  }

  // Sort by order
  sections.sort((a, b) => a.order - b.order);

  return sections;
}

function extractColorScheme(html: string): AnalysisResult['colorScheme'] {
  const colors: AnalysisResult['colorScheme'] = {
    primary: [],
    secondary: [],
    background: [],
    text: [],
  };

  // Extract hex colors from inline styles
  const hexPattern = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;
  const hexMatches = html.match(hexPattern) || [];
  
  // Extract rgb/rgba colors
  const rgbPattern = /rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+)?\s*\)/gi;
  const rgbMatches = html.match(rgbPattern) || [];

  // Categorize colors (simplified heuristic)
  const uniqueColors = [...new Set([...hexMatches, ...rgbMatches])];
  
  uniqueColors.forEach((color, index) => {
    if (index < 2) colors.primary.push(color);
    else if (index < 4) colors.secondary.push(color);
    else if (index < 6) colors.background.push(color);
    else colors.text.push(color);
  });

  return colors;
}

function extractTypography(html: string): AnalysisResult['typography'] {
  const typography: AnalysisResult['typography'] = {
    headingFonts: [],
    bodyFonts: [],
  };

  // Extract font-family declarations
  const fontPattern = /font-family\s*:\s*([^;}"']+)/gi;
  let match;

  while ((match = fontPattern.exec(html)) !== null) {
    const fontFamily = match[1].trim().replace(/['"]/g, '').split(',')[0].trim();
    if (fontFamily && !typography.headingFonts.includes(fontFamily) && !typography.bodyFonts.includes(fontFamily)) {
      if (typography.headingFonts.length < 2) {
        typography.headingFonts.push(fontFamily);
      } else {
        typography.bodyFonts.push(fontFamily);
      }
    }
  }

  return typography;
}
