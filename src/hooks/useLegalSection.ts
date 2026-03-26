import { useState, useEffect, useCallback } from 'react';
import { useArrayItems } from '@/hooks/useArrayItems';
import { useEditorStore } from '@/stores/editorStore';
import type { LegalItem, LegalLayoutSectionData, LegalContentSection } from '@/types/newSectionTypes';
import { termsAndConditionsContent } from '@/content/legal/terms-and-conditions';
import { privacyPolicyContent } from '@/content/legal/privacy-policy';
import { cookiePolicyContent } from '@/content/legal/cookie-policy';
import { cancellationRefundsPolicyContent } from '@/content/legal/cancellation-refunds-policy';
import { complaintsPolicyContent } from '@/content/legal/complaints-policy';
import { abuseHandlingPolicyContent } from '@/content/legal/abuse-handling-policy';
import { antiSpamPolicyContent } from '@/content/legal/anti-spam-policy';

const LEGAL_CONTENT_MAP: Record<string, LegalContentSection[]> = {
  'terms-and-conditions': termsAndConditionsContent,
  'privacy-policy': privacyPolicyContent,
  'cookie-policy': cookiePolicyContent,
  'cancellation-refunds': cancellationRefundsPolicyContent,
  'complaints-policy': complaintsPolicyContent,
  'abuse-handling-policy': abuseHandlingPolicyContent,
  'anti-spam-policy': antiSpamPolicyContent,
};

const DEFAULT_SUBTITLE = 'Kindly read these general terms and policies of the service agreement carefully, as it holds important information regarding your legal rights and remedies.';

const DEFAULT_ITEMS: LegalItem[] = [
  {
    id: 'terms-conditions',
    label: 'Terms and Conditions',
    title: 'General Terms And Conditions',
    subtitle: DEFAULT_SUBTITLE,
    slug: 'terms-and-conditions',
  },
  {
    id: 'privacy-policy',
    label: 'Privacy Policy',
    title: 'Privacy Policy',
    subtitle: 'All privacy policy rights are reserved to UltaHost, and they have the authority to suspend any account which is violating the following clauses of the agreement. By accepting that agreement, you are restricted to following the terms & policies of UltaHost.',
    slug: 'privacy-policy',
  },
  {
    id: 'cookie-policy',
    label: 'Cookie Policy',
    title: 'UltaHost Cookie Policy',
    subtitle: '',
    slug: 'cookie-policy',
  },
  {
    id: 'cancellation-refunds',
    label: 'Cancellation & Refunds Policy',
    title: 'Cancellation & Refunds Policy',
    subtitle: '',
    slug: 'cancellation-refunds',
  },
  {
    id: 'complaints-policy',
    label: 'Complaints Policy',
    title: 'Complaints Policy',
    subtitle: '',
    slug: 'complaints-policy',
  },
  {
    id: 'abuse-handling-policy',
    label: 'Abuse Handling Policy',
    title: 'Abuse Handling Policy',
    subtitle: '',
    slug: 'abuse-handling-policy',
  },
  {
    id: 'anti-spam-policy',
    label: 'Anti Spam Policy',
    title: 'Anti Spam Policy',
    subtitle: '',
    slug: 'anti-spam-policy',
  },
];

export function useLegalSection(data: LegalLayoutSectionData | undefined, sectionId: string | undefined) {
  const updateSectionProps = useEditorStore(state => state.updateSectionProps);
  const defaultActiveSlug = data?.defaultActiveSlug ?? 'terms-and-conditions';

  const storedItems = data?.items || [];
  const itemsWithDefaults = storedItems.length > 0
    ? [
        ...storedItems.map(item => {
          const defaultItem = DEFAULT_ITEMS.find(d => d.slug === item.slug);
          return {
            ...item,
            subtitle: item.subtitle ?? defaultItem?.subtitle ?? DEFAULT_SUBTITLE,
          };
        }),
        // Append any new DEFAULT_ITEMS not yet persisted in stored data
        ...DEFAULT_ITEMS.filter(d => !storedItems.some(i => i.slug === d.slug)),
      ]
    : DEFAULT_ITEMS;

  const { items, getItemProps, SortableWrapper } = useArrayItems<LegalItem>('items', itemsWithDefaults);

  // Initialize default items in store if none exist, subtitles are missing, or new items were added
  useEffect(() => {
    if (sectionId && items.length > 0) {
      const needsUpdate = items.some(item => item.subtitle == null);
      const hasMissingItems = DEFAULT_ITEMS.some(d => !storedItems.some(i => i.slug === d.slug));
      if (needsUpdate || !data?.items || data.items.length === 0 || hasMissingItems) {
        updateSectionProps(sectionId, { items: itemsWithDefaults });
      }
    }
  }, [sectionId]);

  // Read slug from URL hash, fallback to defaultActiveSlug or first item
  const getSlugFromHash = useCallback(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && items.some(item => item.slug === hash)) return hash;
    if (items.some(item => item.slug === defaultActiveSlug)) return defaultActiveSlug;
    return items[0]?.slug ?? defaultActiveSlug;
  }, [items, defaultActiveSlug]);

  const [activeSlug, setActiveSlug] = useState<string>(() => getSlugFromHash());

  // Sync activeSlug when browser back/forward changes the hash
  useEffect(() => {
    const onHashChange = () => setActiveSlug(getSlugFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [getSlugFromHash]);

  // Switch to first item if active slug no longer exists in items
  useEffect(() => {
    if (items.length > 0 && !items.some(item => item.slug === activeSlug)) {
      setActiveSlug(items[0].slug);
    }
  }, [items, activeSlug]);

  const activeItemIndex = items.findIndex(item => item.slug === activeSlug);
  const activeItem = activeItemIndex !== -1 ? items[activeItemIndex] : items[0];
  const displayIndex = activeItemIndex !== -1 ? activeItemIndex : 0;

  // Copy static content into store on first load, or re-sync if section count changed (content was updated)
  useEffect(() => {
    if (sectionId && activeItem) {
      const staticContent = LEGAL_CONTENT_MAP[activeItem.slug];
      if (staticContent && staticContent.length > 0) {
        const needsSync = !activeItem.sections || activeItem.sections.length < staticContent.length;
        if (needsSync) {
          const updatedItems = [...items];
          updatedItems[displayIndex] = { ...activeItem, sections: staticContent };
          updateSectionProps(sectionId, { items: updatedItems });
        }
      }
    }
  }, [sectionId, activeItem?.slug, activeItem?.sections?.length]);

  const sections: LegalContentSection[] = activeItem?.sections || LEGAL_CONTENT_MAP[activeItem?.slug] || [];

  const handleItemClick = useCallback((slug: string) => {
    window.location.hash = slug;
    setActiveSlug(slug);
  }, []);

  return {
    items,
    activeSlug,
    activeItem,
    displayIndex,
    sections,
    defaultSubtitle: DEFAULT_SUBTITLE,
    getItemProps,
    SortableWrapper,
    handleItemClick,
  };
}
