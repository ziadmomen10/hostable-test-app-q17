import { FileText } from 'lucide-react';
import { V2JobPostDescriptionSection } from '@/components/design-v2/sections/V2JobPostDescriptionSection';
import V2JobPostDescriptionSettingsContent from '@/components/admin/sections/V2JobPostDescriptionSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

registerSection({
  type: 'v2-job-post-description',
  displayName: 'V2 Job Post Description',
  icon: FileText,
  category: 'content',
  component: V2JobPostDescriptionSection,
  settingsComponent: createSettingsWrapper(V2JobPostDescriptionSettingsContent),
  defaultProps: {
    applyText: 'Apply Now',
    shareText: 'Share Job',
    sections: [
      {
        id: crypto.randomUUID(),
        title: 'About the Role',
        content: 'UltaHost is seeking a results-driven Business Development Manager to lead new revenue opportunities, form strategic partnerships, and expand our global presence in hosting, cloud, and SaaS markets.',
        hasHighlight: false,
      },
      {
        id: crypto.randomUUID(),
        title: 'Key Responsibilities',
        content: 'Identify, qualify, and pursue new B2B opportunities and strategic partners\nDevelop and manage a pipeline of commercial deals in hosting, tech, and SaaS sectors\nClose reseller and white-label hosting agreements in priority markets\nSupport entry into new regions by negotiating local partnerships\nTrack revenue KPIs, forecast growth impact, and report to executive team',
        hasHighlight: true,
        highlightHeight: 'h-[296px]',
      },
      {
        id: crypto.randomUUID(),
        title: 'Requirements',
        content: '4+ years in business development, partnerships, or strategic sales\nProven ability to close commercial deals and build lasting partner relationships\nStrong negotiation, communication, and cross-functional coordination skills\nFamiliarity with web hosting industry products and competitive landscape\nFluent in English (additional languages are a plus)',
        hasHighlight: true,
        highlightHeight: 'h-60',
      },
      {
        id: crypto.randomUUID(),
        title: 'Nice to Have',
        content: 'Hosting background (reseller, B2B infrastructure, domain sales, etc.)\nExperience managing LTO or hardware vendor relationships\nNetwork of contacts in the cloud/hosting or software integration space',
        hasHighlight: true,
        highlightHeight: 'h-32',
      },
      {
        id: crypto.randomUUID(),
        title: 'What We Offer',
        content: 'Competitive salary plus commission and performance bonuses\nHigh-impact role with direct access to CEO and leadership\nFull remote flexibility or Dubai HQ access\nOpportunity to shape UltaHost\'s commercial growth and global expansion strategy',
        hasHighlight: true,
        highlightHeight: 'h-32',
      },
    ],
    contactItems: [
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/LOY1mjyd/img/icon-2.svg', text: '+1(302) 966-3941' },
      { id: crypto.randomUUID(), icon: 'https://c.animaapp.com/LOY1mjyd/img/icon-3.svg', text: 'hr@ultahost.com' },
    ],
  },
  description: 'Job post description with sortable text sections, apply/share buttons, and contact info.',
  usesDataWrapper: true,
  pageGroup: 'V2 Job Post',
  pageGroupOrder: 2,
  translatableProps: ['applyText', 'shareText', 'sections.*.title', 'sections.*.content'],
  dndArrays: [{ path: 'sections', strategy: 'vertical' }],
});
