import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import type { V2AffiliateHeroSectionData } from '@/types/newSectionTypes';
import type { BaseSectionData } from '@/types/baseSectionTypes';

// Import registry AFTER definitions are loaded
import '@/lib/sections/definitions/v2-affiliate-hero';
import { getSectionDefinition, createSectionInstance } from '@/lib/sections/registry';
import { normalizationRules } from '@/lib/gridNormalizer';
import { V2AffiliateHeroSection } from '../V2AffiliateHeroSection';
import V2AffiliateHeroSettingsContent from '@/components/admin/sections/V2AffiliateHeroSettingsContent';

// Type-level checks — these lines compile only if types are correct
import type { SectionType } from '@/types/pageEditor';
import type { GridWidgetType } from '@/types/grid';
const _sectionType: SectionType = 'v2-affiliate-hero';
const _widgetType: GridWidgetType = 'v2-affiliate-hero-widget';
const _benefitType: GridWidgetType = 'v2-affiliate-benefit-item';

// Mock EditorModeContext so EditableElement renders children normally
vi.mock('@/contexts/EditorModeContext', () => ({
  useEditorModeContext: () => ({
    isEditorMode: false,
    showTranslationBadges: false,
    pageData: null,
  }),
  EditorModeProvider: ({ children }: { children: React.ReactNode }) => children,
  default: React.createContext({
    isEditorMode: false,
    showTranslationBadges: false,
    pageData: null,
  }),
}));

// Mock element registry (used by EditableElement)
vi.mock('@/stores/elementRegistry', () => ({
  registerElement: vi.fn(),
  createElementId: (sectionId: string, path: string) => `${sectionId}-${path}`,
}));

// Mock useTranslationStatus
vi.mock('@/hooks/useTranslationStatus', () => ({
  useTranslationStatus: () => null,
  TranslationStatusType: {},
}));

// ============================================================================
// 1. Section Registry Integration
// ============================================================================
describe('Section Registry Integration', () => {
  it('returns a valid definition for v2-affiliate-hero', () => {
    const def = getSectionDefinition('v2-affiliate-hero');
    expect(def).toBeDefined();
    expect(def!.type).toBe('v2-affiliate-hero');
    expect(def!.displayName).toBe('V2 Affiliate Hero');
    expect(def!.category).toBe('content');
  });

  it('has usesDataWrapper set to true', () => {
    const def = getSectionDefinition('v2-affiliate-hero')!;
    expect(def.usesDataWrapper).toBe(true);
  });

  it('has correct translatableProps with wildcards', () => {
    const def = getSectionDefinition('v2-affiliate-hero')!;
    expect(def.translatableProps).toEqual(
      expect.arrayContaining([
        'badge', 'title', 'subtitle', 'benefits.*.text', 'buttonText', 'secondaryButtonText',
      ])
    );
  });

  it('has empty dndArrays', () => {
    const def = getSectionDefinition('v2-affiliate-hero')!;
    expect(def.dndArrays).toEqual([]);
  });

  it('has correct defaultProps', () => {
    const def = getSectionDefinition('v2-affiliate-hero')!;
    expect(def.defaultProps.badge).toBe('Partner Program');
    expect(def.defaultProps.title).toBe('Earn More by Promoting Hostonce');
    expect(def.defaultProps.benefits).toHaveLength(3);
    expect(def.defaultProps.buttonText).toBe('Become an Affiliate');
    expect(def.defaultProps.secondaryButtonText).toBe('Log In');
  });

  it('creates a valid section instance', () => {
    const instance = createSectionInstance('v2-affiliate-hero');
    expect(instance).not.toBeNull();
    expect(instance!.type).toBe('v2-affiliate-hero');
    expect(instance!.props.badge).toBe('Partner Program');
    expect(instance!.visible).toBe(true);
  });
});

// ============================================================================
// 2. Grid Normalizer Integration
// ============================================================================
describe('Grid Normalizer Integration', () => {
  it('has a normalization rule for v2-affiliate-hero', () => {
    const rule = normalizationRules['v2-affiliate-hero'];
    expect(rule).toBeDefined();
    expect(rule.sectionType).toBe('v2-affiliate-hero');
  });

  it('maps benefits array to v2-affiliate-benefit-item widget', () => {
    const rule = normalizationRules['v2-affiliate-hero'];
    expect(rule.arrayPaths).toEqual([
      { arrayPath: 'benefits', widgetType: 'v2-affiliate-benefit-item', columnDistribution: 'single' },
    ]);
  });

  it('has usesDataWrapper true and correct headerProps', () => {
    const rule = normalizationRules['v2-affiliate-hero'];
    expect(rule.usesDataWrapper).toBe(true);
    expect(rule.headerProps).toEqual(
      expect.arrayContaining(['badge', 'title', 'subtitle', 'buttonText', 'buttonLink', 'secondaryButtonText', 'secondaryButtonLink'])
    );
  });
});

// ============================================================================
// 3. Type System Integration (compile-time)
// ============================================================================
describe('Type System Integration', () => {
  it('compiles with correct SectionType and GridWidgetType values', () => {
    // If these assignments compiled, the types are valid
    expect(_sectionType).toBe('v2-affiliate-hero');
    expect(_widgetType).toBe('v2-affiliate-hero-widget');
    expect(_benefitType).toBe('v2-affiliate-benefit-item');
  });
});

// ============================================================================
// 4. Display Component — Default Rendering
// ============================================================================
describe('V2AffiliateHeroSection — Default Rendering', () => {
  it('renders all default content when no data prop is provided', () => {
    render(<V2AffiliateHeroSection />);
    
    // Badge — first word is bold, rest is plain
    expect(screen.getByText('hostonce')).toBeInTheDocument();
    expect(screen.getByText('Partner Program')).toBeInTheDocument();

    // Title
    expect(screen.getByText('Earn More by Promoting Hostonce')).toBeInTheDocument();

    // Subtitle
    expect(screen.getByText(/Join an affiliate program/)).toBeInTheDocument();

    // Benefits
    expect(screen.getByText('Up to 60% Commission')).toBeInTheDocument();
    expect(screen.getByText('No Approval Required')).toBeInTheDocument();
    expect(screen.getByText('Monthly & Yearly Plan Commission')).toBeInTheDocument();

    // Buttons
    expect(screen.getByText('Become an Affiliate')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });
});

// ============================================================================
// 5. Display Component — Custom Data Rendering
// ============================================================================
describe('V2AffiliateHeroSection — Custom Data', () => {
  it('renders custom data instead of defaults', () => {
    const customData = {
      badge: 'Custom Badge',
      title: 'Custom Title',
      subtitle: 'Custom subtitle text.',
      benefits: [{ text: 'Benefit A' }, { text: 'Benefit B' }],
      buttonText: 'Sign Up Now',
      buttonLink: '/signup',
      secondaryButtonText: 'Learn More',
      secondaryButtonLink: '/about',
    };

    render(<V2AffiliateHeroSection data={customData} />);

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom subtitle text.')).toBeInTheDocument();
    expect(screen.getByText('Benefit A')).toBeInTheDocument();
    expect(screen.getByText('Benefit B')).toBeInTheDocument();
    expect(screen.queryByText('Up to 60% Commission')).not.toBeInTheDocument();
    expect(screen.getByText('Sign Up Now')).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });
});

// ============================================================================
// 6. Accessibility
// ============================================================================
describe('V2AffiliateHeroSection — Accessibility', () => {
  it('has aria-labelledby on section pointing to heading id', () => {
    const { container } = render(<V2AffiliateHeroSection />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('aria-labelledby', 'v2-affiliate-hero-heading');

    const heading = container.querySelector('#v2-affiliate-hero-heading');
    expect(heading).toBeInTheDocument();
  });

  it('marks decorative SVGs as aria-hidden', () => {
    const { container } = render(<V2AffiliateHeroSection />);
    const svgs = container.querySelectorAll('svg[aria-hidden="true"]');
    // Each benefit has one decorative SVG + the button arrow SVG
    expect(svgs.length).toBeGreaterThanOrEqual(3);
  });
});

// ============================================================================
// 7 & 8. Settings Panel
// ============================================================================
describe('V2AffiliateHeroSettingsContent', () => {
  const mockData = {
    badge: 'Test Badge',
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    benefits: [{ text: 'Benefit 1' }, { text: 'Benefit 2' }],
    buttonText: 'CTA',
    buttonLink: '/cta',
    secondaryButtonText: 'Secondary',
    secondaryButtonLink: '/secondary',
  };

  let onChange: (data: V2AffiliateHeroSectionData & BaseSectionData) => void;

  beforeEach(() => {
    onChange = vi.fn() as unknown as (data: V2AffiliateHeroSectionData & BaseSectionData) => void;
  });

  it('renders all settings fields', () => {
    render(<V2AffiliateHeroSettingsContent data={mockData} onChange={onChange} />);

    // Section headers
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Benefits')).toBeInTheDocument();
    expect(screen.getByText('Primary Button')).toBeInTheDocument();
    expect(screen.getByText('Secondary Button')).toBeInTheDocument();

    // Labels
    expect(screen.getByText('Badge Text')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  it('renders benefit items with delete buttons', () => {
    const { container } = render(<V2AffiliateHeroSettingsContent data={mockData} onChange={onChange} />);
    // 2 benefits → 2 delete buttons (Trash2 icons)
    const deleteButtons = container.querySelectorAll('button');
    // Add button + 2 delete buttons = at least 3
    expect(deleteButtons.length).toBeGreaterThanOrEqual(3);
  });

  it('calls onChange with new benefit when Add is clicked', () => {
    render(<V2AffiliateHeroSettingsContent data={mockData} onChange={onChange} />);
    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        benefits: expect.arrayContaining([
          { text: 'Benefit 1' },
          { text: 'Benefit 2' },
          { text: 'New Benefit' },
        ]),
      })
    );
  });

  it('calls onChange with benefit removed when delete is clicked', () => {
    const { container } = render(<V2AffiliateHeroSettingsContent data={mockData} onChange={onChange} />);
    // Find the small icon-only delete buttons (w-8 p-0 class pattern)
    const deleteButtons = container.querySelectorAll('button.w-8.p-0');
    
    expect(deleteButtons.length).toBe(2); // One per benefit
    fireEvent.click(deleteButtons[0]);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        benefits: [{ text: 'Benefit 2' }],
      })
    );
  });
});
