import { MessageSquareQuote } from 'lucide-react';
import { V2AffiliateReviewsSection } from '@/components/design-v2/sections/V2AffiliateReviewsSection';
import V2AffiliateReviewsSettingsContent from '@/components/admin/sections/V2AffiliateReviewsSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-affiliate-reviews',
  displayName: 'V2 Affiliate Reviews',
  icon: MessageSquareQuote,
  category: 'content',
  component: V2AffiliateReviewsSection,
  settingsComponent: createSettingsWrapper(V2AffiliateReviewsSettingsContent),
  defaultProps: {
    title: 'Hear It From Our Partners',
    rightImage: '/lovable-uploads/reviews/Main.png',
    footerImage: '/lovable-uploads/reviews/Trustpilot Reviews-footer.png',
    reviews: [
      {
        id: crypto.randomUUID(),
        starIcon: '/lovable-uploads/reviews/Icon-stars.png',
        rating: 5,
        text: 'My experience with HostOnce has been exceptional! The products that are offered along with the tools you can use for website.',
        authorAvatar: '/lovable-uploads/reviews/icon-lauren.png',
        authorName: 'Lauren Thompson',
        badge: 'Partner',
      },
      {
        id: crypto.randomUUID(),
        starIcon: '/lovable-uploads/reviews/Icon-stars.png',
        rating: 5,
        text: 'My experience with HostOnce has been exceptional! The products that are offered along with the tools you can use for website.',
        authorAvatar: '/lovable-uploads/reviews/icon-lauren.png',
        authorName: 'Lauren Thompson',
        badge: 'Partner',
      },
    ],
  },
  description: 'V2 Affiliate Partner Program reviews section with partner testimonials, star ratings, right side image, and Trustpilot footer banner.',
  usesDataWrapper: true,
  pageGroup: 'V2 Affiliate Partner Program',
  pageGroupOrder: 6,
  translatableProps: [
    'title',
    'reviews.*.text',
    'reviews.*.authorName',
    'reviews.*.badge',
  ],
  dndArrays: [{ path: 'reviews', strategy: 'grid' }],
});
