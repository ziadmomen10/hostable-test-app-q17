import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to check if text contains Arabic characters
function containsArabic(text: string): boolean {
  if (typeof text !== 'string') return false;
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

// Helper to get nested value from object using dot notation path
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined) return undefined;
    if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  
  return current;
}

// Helper to set nested value in object using dot notation path
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.');
  let current: Record<string, unknown> = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    
    if (!(key in current) || current[key] === null || current[key] === undefined) {
      current[key] = !isNaN(Number(nextKey)) ? [] : {};
    }
    
    current = current[key] as Record<string, unknown>;
  }
  
  const finalKey = keys[keys.length - 1];
  current[finalKey] = value;
}

// Default English values for common section types
// These are fallback values when no source is available
const defaultEnglishValues: Record<string, Record<string, string>> = {
  hero: {
    badge: 'Powered by AI',
    title: '20x Faster Web Hosting',
    highlightedText: '20x Faster',
    subtitle: 'Super-fast yet affordable hosting.',
    primaryButtonText: 'See Plans & Pricing',
    secondaryButtonText: 'Learn More',
    'services.0.label': 'AI Website Builder',
    'services.1.label': 'Domains',
    'services.2.label': 'WordPress Hosting',
    'services.3.label': 'Business Email',
    'services.4.label': 'VPS Hosting',
    'services.5.label': 'Dedicated Hosting',
    'services.6.label': 'VDS Hosting',
  },
  'bento-grid': {
    badge: 'WHY CHOOSE US',
    title: 'Everything You Need',
    subtitle: 'Powerful features for your success.',
    'items.0.title': 'Lightning Performance',
    'items.0.description': 'NVMe SSD drives and LiteSpeed servers deliver 20x faster load times.',
    'items.1.title': 'Easy Management',
    'items.1.description': 'Intuitive control panel with one-click installation for 400+ apps.',
    'items.2.title': 'Global CDN',
    'items.2.description': 'Content delivery from 200+ locations.',
    'items.3.title': 'Enterprise Security',
    'items.3.description': 'Free SSL, DDoS protection, and daily backups included.',
    'items.4.title': '24/7 Support',
    'items.4.description': 'Expert help whenever you need it.',
  },
  pricing: {
    badge: 'PRICING',
    title: 'Choose Your Plan',
    subtitle: 'Flexible plans for every need.',
    'plans.0.name': 'Enterprise',
    'plans.0.description': 'For large-scale operations',
    'plans.0.buttonText': 'Contact Sales',
    'plans.1.name': 'Business',
    'plans.1.description': 'Best for growing businesses',
    'plans.1.buttonText': 'Get Started',
    'plans.2.name': 'Starter',
    'plans.2.description': 'Perfect for small projects',
    'plans.2.buttonText': 'Get Started',
  },
  'plans-comparison': {
    badge: 'COMPARE',
    title: 'Compare Plans',
    subtitle: 'Find the perfect plan for your needs',
    'plans.0.name': 'Starter',
    'plans.1.name': 'Pro',
    'plans.2.name': 'Enterprise',
    'plans.3.name': 'Business',
    'features.0.feature': 'Websites',
    'features.1.feature': 'Storage',
    'features.2.feature': 'Bandwidth',
    'features.3.feature': 'Email Accounts',
    'features.4.feature': 'Free SSL Certificate',
    'features.5.feature': 'Daily Backups',
    'features.6.feature': 'Priority Support',
    'features.7.feature': 'Dedicated IP',
  },
  'server-specs': {
    badge: 'SERVERS',
    title: 'Server Specifications',
    subtitle: 'Choose the configuration that fits your needs.',
    'specs.0.name': 'Growth VPS',
    'specs.1.name': 'Starter VPS',
    'specs.2.name': 'Business VPS',
    'specs.3.name': 'Enterprise VPS',
  },
  features: {
    title: 'Powerful Features',
    subtitle: 'Everything you need to build, grow, and scale.',
    buttonText: 'Explore All Features',
    'features.0.title': 'The Fastest Way to Go Online',
    'features.0.description': 'Our optimized infrastructure delivers 20x faster load times compared to traditional hosting providers.',
    'features.1.title': 'Start Securely with Enterprise-Grade Protection',
    'features.1.description': 'Every account comes with enterprise-level security features to keep your website safe.',
  },
  testimonials: {
    badge: 'TESTIMONIALS',
    title: "Don't Take Our Word For It",
    subtitle: 'See what our customers have to say.',
    'testimonials.0.name': 'Michael Johnson',
    'testimonials.0.role': 'E-commerce Store Owner',
    'testimonials.0.text': 'Migrating to HostOnce was the best decision I made for my online store. Page load times dropped by 60% and my sales increased significantly.',
    'testimonials.1.name': 'David Chen',
    'testimonials.1.role': 'Web Developer',
    'testimonials.1.text': 'The developer tools and SSH access make HostOnce a perfect choice for my projects. I can deploy with confidence knowing the infrastructure is solid.',
    'testimonials.2.name': 'Emily Roberts',
    'testimonials.2.role': 'Blogger',
    'testimonials.2.text': "I was worried about migrating my 5-year-old blog, but the HostOnce team made the process seamless. Zero downtime and everything works perfectly!",
  },
  'why-choose': {
    badge: 'WHY US',
    title: 'Why Choose HostOnce',
    subtitle: 'We combine cutting-edge technology with exceptional support.',
    'reasons.0.title': 'Lightning Fast',
    'reasons.0.description': 'NVMe SSD storage and LiteSpeed servers for ultra-fast performance.',
    'reasons.1.title': 'Secure & Protected',
    'reasons.1.description': 'Free SSL certificate, DDoS protection, and daily backups included.',
    'reasons.2.title': '99.9% Uptime',
    'reasons.2.description': 'Guaranteed uptime with redundant infrastructure and continuous monitoring.',
    'reasons.3.title': '24/7 Expert Support',
    'reasons.3.description': 'Real people ready to help you anytime, day or night.',
    'reasons.4.title': 'Easy Management',
    'reasons.4.description': 'Intuitive control panel makes managing your hosting incredibly easy.',
    'reasons.5.title': 'Global CDN',
    'reasons.5.description': 'Content delivery network with 200+ edge locations worldwide.',
  },
  'need-help': {
    badge: 'SUPPORT',
    title: 'Need Help?',
    subtitle: 'Our award-winning support team is here to help you 24/7.',
    'options.0.title': 'Live Chat',
    'options.0.description': 'Talk to our support team in real-time for instant answers.',
    'options.1.title': 'Phone Support',
    'options.1.description': 'Speak directly with our support specialists for complex issues.',
    'options.2.title': 'Email Support',
    'options.2.description': 'Send us an email and we\'ll get back to you soon.',
    'options.3.title': 'Knowledge Base',
    'options.3.description': 'Browse our extensive documentation and tutorials.',
  },
  'hosting-services': {
    badge: 'OUR SERVICES',
    title: 'Hosting Solutions',
    subtitle: 'Find the perfect hosting for your needs.',
    'services.0.title': 'Web Hosting',
    'services.0.description': 'Perfect for websites and blogs.',
    'services.1.title': 'WordPress Hosting',
    'services.1.description': 'Optimized for WordPress.',
    'services.2.title': 'Cloud Hosting',
    'services.2.description': 'Scalable cloud infrastructure.',
    'services.3.title': 'VPS Hosting',
    'services.3.description': 'Virtual private servers.',
    'services.4.title': 'Dedicated Hosting',
    'services.4.description': 'Full root access with dedicated resources.',
    'services.5.title': 'Dedicated Servers',
    'services.5.description': 'Enterprise-grade hardware with full customization and maximum performance.',
  },
  faq: {
    badge: 'FAQ',
    title: 'Frequently Asked Questions',
    subtitle: 'Find answers to common questions.',
    'faqs.0.question': 'What is web hosting?',
    'faqs.0.answer': 'Web hosting is a service that allows you to publish your website on the internet.',
    'faqs.1.question': 'Do you offer a money-back guarantee?',
    'faqs.1.answer': 'Yes, we offer a 30-day money-back guarantee.',
    'faqs.2.question': 'Can I upgrade my plan later?',
    'faqs.2.answer': 'Yes, you can upgrade at any time.',
    'faqs.3.question': 'Do you provide free SSL?',
    'faqs.3.answer': 'Yes, all plans include free SSL certificates.',
    'faqs.4.question': 'What support do you offer?',
    'faqs.4.answer': '24/7 support via chat, email, and phone.',
    'faqs.5.question': 'Can I migrate my site?',
    'faqs.5.answer': 'Yes, we offer free migration assistance.',
  },
  cta: {
    title: 'Ready to Get Started?',
    subtitle: 'Join thousands of satisfied customers.',
    primaryButtonText: 'Get Started',
    secondaryButtonText: 'Learn More',
  },
  'stats-counter': {
    badge: 'STATS',
    title: 'By the Numbers',
    subtitle: 'Trusted by thousands worldwide.',
    'stats.0.label': 'Uptime Guarantee',
    'stats.0.value': '99.9%',
    'stats.1.label': 'Happy Customers',
    'stats.1.value': '50K+',
    'stats.2.label': 'Expert Support',
    'stats.2.value': '24/7',
    'stats.3.label': 'Data Centers',
    'stats.3.value': '10+',
  },
  steps: {
    badge: 'HOW IT WORKS',
    title: 'Get Started in 3 Easy Steps',
    subtitle: 'Launch your website in minutes.',
    'steps.0.title': 'Choose Your Plan',
    'steps.0.description': 'Select the hosting plan that fits your needs and budget.',
    'steps.1.title': 'Set Up Your Account',
    'steps.1.description': 'Quick signup with instant activation and one-click installs.',
    'steps.2.title': 'Launch Your Site',
    'steps.2.description': 'Deploy your website and go live with our easy-to-use tools.',
  },
  'icon-features': {
    badge: 'FEATURES',
    title: 'Powerful Features',
    subtitle: 'Everything you need to succeed online.',
    'features.0.title': 'Lightning Performance',
    'features.0.description': 'Ultra-fast servers with NVMe SSD storage and optimized caching.',
    'features.1.title': 'Security First',
    'features.1.description': 'Includes free SSL, DDoS protection, and daily backups.',
    'features.2.title': 'Global CDN',
    'features.2.description': 'Content delivery from 200+ edge locations for faster loading.',
    'features.3.title': 'Analytics',
    'features.3.description': 'Real-time insights into traffic, performance, and visitor behavior.',
    'features.4.title': 'Easy Setup',
    'features.4.description': 'One-click installs for WordPress, Joomla, and 400+ apps.',
    'features.5.title': '24/7 Support',
    'features.5.description': 'Expert help available around the clock via chat, email, and phone.',
  },
  'alternating-features': {
    badge: 'WHY US',
    title: 'Why Choose HostOnce',
    subtitle: 'Built for performance, security, and reliability.',
    'blocks.0.title': 'Lightning Fast Performance',
    'blocks.0.description': 'Experience blazing-fast load times with our optimized infrastructure and global CDN.',
    'blocks.0.bullets.0': 'NVMe SSD Storage',
    'blocks.0.bullets.1': 'HTTP/3 Support',
    'blocks.0.bullets.2': 'Global CDN Included',
    'blocks.1.title': 'Enterprise-Grade Security',
    'blocks.1.description': 'Keep your site and data secure with our comprehensive security suite.',
    'blocks.1.bullets.0': 'Free SSL Certificates',
    'blocks.1.bullets.1': 'DDoS Protection',
    'blocks.1.bullets.2': 'Daily Backups',
    'blocks.1.bullets.3': 'Malware Scanning',
    'blocks.2.title': '24/7 Expert Support',
    'blocks.2.description': 'Our team of hosting experts is available around the clock to help you.',
    'blocks.2.bullets.0': 'Live Chat Support',
    'blocks.2.bullets.1': 'Phone Support',
    'blocks.2.bullets.2': 'Ticket System',
    'blocks.2.bullets.3': 'Knowledge Base',
  },
  'data-center': {
    badge: 'GLOBAL NETWORK',
    title: 'Data Centers Worldwide',
    subtitle: 'Choose the location closest to your audience.',
    'locations.0.city': 'New York',
    'locations.0.country': 'United States',
    'locations.1.city': 'Los Angeles',
    'locations.1.country': 'United States',
    'locations.2.city': 'London',
    'locations.2.country': 'United Kingdom',
    'locations.3.city': 'Frankfurt',
    'locations.3.country': 'Germany',
    'locations.4.city': 'Singapore',
    'locations.4.country': 'Singapore',
    'locations.5.city': 'Tokyo',
    'locations.5.country': 'Japan',
  },
  awards: {
    badge: 'AWARDS',
    title: 'Award-Winning Hosting',
    subtitle: 'Recognized by industry experts.',
    'awards.0.name': 'Best Web Hosting 2024',
    'awards.1.name': 'Top Rated Support',
    'awards.2.name': 'Fastest Hosting',
    'awards.3.name': 'Best Value Hosting',
  },
  'blog-grid': {
    badge: 'BLOG',
    title: 'Latest from Our Blog',
    subtitle: 'Tips, tutorials, and industry insights.',
    'articles.0.title': 'Getting Started with Web Hosting',
    'articles.0.excerpt': 'Learn the basics of web hosting and how to choose the right plan for your needs.',
    'articles.1.title': 'Speed Optimization Tips',
    'articles.1.excerpt': 'Discover proven techniques to speed up your website and improve user experience.',
    'articles.2.title': 'Security Best Practices',
    'articles.2.excerpt': 'Essential security measures every website owner should implement.',
  },
  contact: {
    badge: 'CONTACT',
    title: 'Get in Touch',
    subtitle: 'We\'re here to help you succeed.',
    'channels.0.title': 'Email Us',
    'channels.0.description': 'We\'ll respond within 24 hours.',
    'channels.0.buttonText': 'Send Email',
    'channels.1.title': 'Call Us',
    'channels.1.description': 'Available 24/7 for urgent issues.',
    'channels.1.buttonText': 'Call Now',
    'channels.2.title': 'Live Chat',
    'channels.2.description': 'Instant support from our team.',
    'channels.2.buttonText': 'Start Chat',
    'channels.3.title': 'Visit Us',
    'channels.3.description': 'Our headquarters location.',
    'channels.3.buttonText': 'Get Directions',
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { pageId, dryRun = true } = await req.json();

    console.log(`Starting fix-page-translations for pageId: ${pageId || 'all'}, dryRun: ${dryRun}`);

    // Get English language ID
    const { data: englishLang, error: langError } = await supabase
      .from('languages')
      .select('id, code')
      .eq('code', 'en')
      .single();

    if (langError || !englishLang) {
      throw new Error('Could not find English language: ' + langError?.message);
    }

    console.log('English language ID:', englishLang.id);

    // Fetch pages with JSON content
    let pagesQuery = supabase
      .from('pages')
      .select('id, page_url, content')
      .not('content', 'is', null);

    if (pageId) {
      pagesQuery = pagesQuery.eq('id', pageId);
    }

    const { data: pages, error: pagesError } = await pagesQuery;

    if (pagesError) {
      throw new Error('Failed to fetch pages: ' + pagesError.message);
    }

    console.log(`Found ${pages?.length || 0} pages to process`);

    const results: Array<{
      pageId: string;
      pageUrl: string;
      sectionsFixed: number;
      propsFixed: number;
      details: string[];
    }> = [];

    for (const page of pages || []) {
      if (!page.content || typeof page.content !== 'string') continue;

      let content;
      try {
        content = JSON.parse(page.content);
      } catch {
        console.log(`Page ${page.page_url} has non-JSON content, skipping`);
        continue;
      }

      if (!content.sections || !Array.isArray(content.sections)) {
        console.log(`Page ${page.page_url} has no sections array, skipping`);
        continue;
      }

      const pageResult = {
        pageId: page.id,
        pageUrl: page.page_url,
        sectionsFixed: 0,
        propsFixed: 0,
        details: [] as string[],
      };

      let contentModified = false;

      for (const section of content.sections) {
        if (!section.translationKeys || typeof section.translationKeys !== 'object') {
          continue;
        }

        const sectionType = section.type || '';

        for (const [propPath, translationKey] of Object.entries(section.translationKeys)) {
          if (!translationKey || typeof translationKey !== 'string') continue;

          // Get current prop value
          const currentValue = getNestedValue(section.props || {}, propPath);
          
          if (typeof currentValue !== 'string') continue;
          
          // Check if current value contains Arabic
          if (!containsArabic(currentValue)) continue;

          // Try to find English value from multiple sources:
          let newValue: string | null = null;
          let source = '';

          // 1. Try English translation
          const { data: englishTranslation } = await supabase
            .from('translations')
            .select('value')
            .eq('key', translationKey)
            .eq('language_id', englishLang.id)
            .maybeSingle();

          if (englishTranslation?.value && !containsArabic(englishTranslation.value)) {
            newValue = englishTranslation.value;
            source = 'en translation';
          }

          // 2. Try source_text from translation_keys
          if (!newValue) {
            const { data: keyRecord } = await supabase
              .from('translation_keys')
              .select('source_text')
              .eq('key', translationKey)
              .maybeSingle();

            if (keyRecord?.source_text && !containsArabic(keyRecord.source_text)) {
              newValue = keyRecord.source_text;
              source = 'source_text';
            }
          }

          // 3. Try default values based on section type
          if (!newValue && defaultEnglishValues[sectionType]) {
            const defaultValue = defaultEnglishValues[sectionType][propPath];
            if (defaultValue) {
              newValue = defaultValue;
              source = 'default';
            }
          }

          if (newValue) {
            pageResult.details.push(
              `[${sectionType}] "${propPath}" (${source}): "${currentValue.substring(0, 30)}..." → "${newValue.substring(0, 30)}..."`
            );
            
            if (!section.props) section.props = {};
            setNestedValue(section.props, propPath, newValue);
            pageResult.propsFixed++;
            contentModified = true;

            // Also update/create the English translation
            if (!dryRun) {
              await supabase
                .from('translations')
                .upsert({
                  key: translationKey,
                  language_id: englishLang.id,
                  value: newValue,
                  status: 'edited',
                  namespace: 'page',
                }, { onConflict: 'key,language_id' });

              // Update source_text if empty
              await supabase
                .from('translation_keys')
                .update({ source_text: newValue })
                .eq('key', translationKey)
                .or('source_text.is.null,source_text.eq.');
            }
          } else {
            pageResult.details.push(
              `[${sectionType}] "${propPath}": NO SOURCE FOUND - NEEDS MANUAL FIX. "${currentValue.substring(0, 40)}..."`
            );
          }
        }

        if (pageResult.propsFixed > 0) {
          pageResult.sectionsFixed++;
        }
      }

      if (contentModified && !dryRun) {
        const { error: updateError } = await supabase
          .from('pages')
          .update({ content: JSON.stringify(content) })
          .eq('id', page.id);

        if (updateError) {
          pageResult.details.push(`ERROR saving page: ${updateError.message}`);
        } else {
          pageResult.details.push('✓ Page content updated successfully');
        }
      }

      if (pageResult.propsFixed > 0 || pageResult.details.length > 0) {
        results.push(pageResult);
      }
    }

    const summary = {
      dryRun,
      pagesProcessed: pages?.length || 0,
      pagesFixed: results.filter(r => r.propsFixed > 0).length,
      totalPropsFixed: results.reduce((sum, r) => sum + r.propsFixed, 0),
      results,
    };

    console.log('Summary:', JSON.stringify(summary, null, 2));

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fix-page-translations:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
