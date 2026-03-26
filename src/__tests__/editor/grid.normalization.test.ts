/**
 * Grid Normalization Tests
 * 
 * Verifies that:
 * 1. Existing sections normalize correctly to grid format
 * 2. Normalized sections preserve original visual output
 * 3. Grid → Props denormalization works for saving
 */

import { describe, it, expect } from 'vitest';
import { normalizeSection, denormalizeGrid, normalizationRules } from '@/lib/gridNormalizer';
import { SectionInstance } from '@/types/reactEditor';

describe('Grid Normalization Engine', () => {
  // Sample section data matching existing format
  const createMockSection = (type: string, props: Record<string, any>): SectionInstance => ({
    id: `section-${type}-test`,
    type: type as any,
    props,
    order: 0,
    visible: true,
  });

  describe('normalizeSection', () => {
    it('should normalize a features section with array items', () => {
      const section = createMockSection('features', {
        badge: 'Features',
        title: 'Why Choose Us',
        subtitle: 'Best hosting provider',
        features: [
          { icon: 'Zap', title: 'Fast', description: 'Super fast hosting' },
          { icon: 'Shield', title: 'Secure', description: 'Enterprise security' },
          { icon: 'Cloud', title: 'Scalable', description: 'Scale on demand' },
        ],
      });

      const normalized = normalizeSection(section);

      // Check structure
      expect(normalized.id).toBe(section.id);
      expect(normalized.type).toBe('features');
      expect(normalized.isNormalized).toBe(true);
      
      // Check header props extracted
      expect(normalized.headerProps.badge).toBe('Features');
      expect(normalized.headerProps.title).toBe('Why Choose Us');
      expect(normalized.headerProps.subtitle).toBe('Best hosting provider');
      
      // Check grid columns created (one per feature in 2-col layout = 3 columns)
      expect(normalized.grid.columns.length).toBe(3);
      
      // Check widgets created
      const allWidgets = normalized.grid.columns.flatMap(c => c.widgets);
      expect(allWidgets.length).toBe(3);
      expect(allWidgets[0].type).toBe('feature-card');
      expect(allWidgets[0].props.title).toBe('Fast');
    });

    it('should normalize a pricing section with plans', () => {
      const section = createMockSection('pricing', {
        badge: 'Pricing',
        title: 'Choose Your Plan',
        plans: [
          { name: 'Basic', price: '$9.99', features: [] },
          { name: 'Pro', price: '$19.99', features: [] },
          { name: 'Enterprise', price: '$49.99', features: [] },
        ],
      });

      const normalized = normalizeSection(section);

      expect(normalized.grid.columns.length).toBe(3);
      
      const widgets = normalized.grid.columns.flatMap(c => c.widgets);
      expect(widgets.length).toBe(3);
      expect(widgets.every(w => w.type === 'plan-card')).toBe(true);
    });

    it('should handle FAQ section with single-column layout', () => {
      const section = createMockSection('faq', {
        badge: 'FAQ',
        title: 'Questions',
        faqs: [
          { question: 'Q1?', answer: 'A1' },
          { question: 'Q2?', answer: 'A2' },
        ],
      });

      const normalized = normalizeSection(section);

      // FAQ uses single column distribution - all widgets in one column
      expect(normalized.grid.columns.length).toBe(1);
      expect(normalized.grid.columns[0].widgets.length).toBe(2);
    });

    it('should handle sections with data wrapper', () => {
      const section = createMockSection('stats-counter', {
        data: {
          badge: 'Stats',
          title: 'Our Numbers',
          stats: [
            { value: '1000+', label: 'Customers' },
            { value: '99.9%', label: 'Uptime' },
          ],
        },
      });

      const normalized = normalizeSection(section);

      expect(normalized.headerProps.badge).toBe('Stats');
      expect(normalized.grid.columns.length).toBe(2);
    });

    it('should return original grid if section has explicit grid', () => {
      const section: SectionInstance = {
        id: 'section-with-grid',
        type: 'features',
        props: { title: 'Test' },
        order: 0,
        visible: true,
        grid: {
          columns: [
            { id: 'col-1', width: { desktop: '50%' }, widgets: [] },
            { id: 'col-2', width: { desktop: '50%' }, widgets: [] },
          ],
          gap: '2rem',
        },
      };

      const normalized = normalizeSection(section);

      expect(normalized.isNormalized).toBe(false);
      expect(normalized.grid.columns.length).toBe(2);
      expect(normalized.grid.gap).toBe('2rem');
    });
  });

  describe('denormalizeGrid', () => {
    it('should convert grid back to legacy props format', () => {
      const section = createMockSection('features', {
        badge: 'Features',
        title: 'Test',
        features: [
          { icon: 'Zap', title: 'Fast', description: 'Desc 1' },
          { icon: 'Shield', title: 'Secure', description: 'Desc 2' },
        ],
      });

      const normalized = normalizeSection(section);
      const denormalized = denormalizeGrid(normalized, 'features');

      // Should have header props
      expect(denormalized.badge).toBe('Features');
      expect(denormalized.title).toBe('Test');
      
      // Should have features array rebuilt
      expect(denormalized.features).toHaveLength(2);
      expect(denormalized.features[0].title).toBe('Fast');
      expect(denormalized.features[1].title).toBe('Secure');
    });

    it('should handle data wrapper sections', () => {
      const section = createMockSection('stats-counter', {
        data: {
          badge: 'Stats',
          stats: [{ value: '100', label: 'Test' }],
        },
      });

      const normalized = normalizeSection(section);
      const denormalized = denormalizeGrid(normalized, 'stats-counter');

      expect(denormalized.data).toBeDefined();
      expect(denormalized.data.badge).toBe('Stats');
    });
  });

  describe('normalizationRules', () => {
    it('should have rules for all common section types', () => {
      const expectedTypes = [
        'hero', 'pricing', 'features', 'faq', 'testimonials',
        'cta', 'hosting-services', 'why-choose', 'need-help',
      ];

      for (const type of expectedTypes) {
        expect(normalizationRules[type as keyof typeof normalizationRules]).toBeDefined();
      }
    });

    it('should have consistent rule structure', () => {
      for (const [type, rule] of Object.entries(normalizationRules)) {
        expect(rule.sectionType).toBe(type);
        expect(Array.isArray(rule.arrayPaths)).toBe(true);
        expect(typeof rule.defaultColumns).toBe('number');
        expect(Array.isArray(rule.headerProps)).toBe(true);
        expect(typeof rule.usesDataWrapper).toBe('boolean');
      }
    });
  });
});
