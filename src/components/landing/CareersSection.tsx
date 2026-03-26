/**
 * Careers Section
 * Displays open job positions at a company
 * 
 * Created following SECTION_DEVELOPER_GUIDE.md
 */

import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import { BaseSectionProps } from '@/types/baseSectionTypes';
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableItem } from '@/components/editor/SortableItem';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Building2, Wifi, ExternalLink } from 'lucide-react';
import type { JobItem, CareersSectionData } from '@/types/newSectionTypes';

// ============================================
// COMPONENT PROPS
// ============================================

interface CareersSectionProps extends BaseSectionProps {
  data: CareersSectionData;
}

// ============================================
// COMPONENT
// ============================================

export function CareersSection({ data, sectionId, styleOverrides, layoutProps }: CareersSectionProps) {
  // Set up drag-and-drop for the jobs array
  // SortableWrapper is returned by the hook (not imported separately)
  const { items: jobs, SortableWrapper, getItemProps, isEnabled } = useArrayItems(
    'jobs',           // arrayPath - must match dndArrays config in registration
    data.jobs || []   // the array data
  );

  // Get layout settings with defaults
  const columns = data.columns || 3;
  const alignment = layoutProps?.contentAlignment || 'center';

  // Map job type to badge variant
  const getTypeBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full-time':
        return 'default';
      case 'part-time':
        return 'secondary';
      case 'contract':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <SectionContainer
      id={sectionId}
      styleOverrides={styleOverrides}
    >
      {/* Section Header */}
      <SectionHeader
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        alignment={alignment}
      />

      {/* Jobs Grid with DnD */}
      {/* SortableWrapper takes no props - it's pre-configured by the hook */}
      <SortableWrapper>
        <div 
          className="grid gap-6 mt-10"
          style={{ 
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {jobs.map((job, index) => (
            // Spread getItemProps(index) to get all required DnD props
            <SortableItem
              key={job.id}
              {...getItemProps(index)}
            >
              <div className="group relative flex flex-col h-full p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                {/* Header: Title + Remote Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  {job.remote && (
                    <Badge variant="secondary" className="shrink-0 gap-1">
                      <Wifi className="w-3 h-3" />
                      Remote
                    </Badge>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-3 mb-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    {job.department}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                </div>

                {/* Type Badge */}
                <div className="mb-4">
                  <Badge variant={getTypeBadgeVariant(job.type)}>
                    <Briefcase className="w-3 h-3 mr-1" />
                    {job.type}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-6 flex-grow">
                  {job.description}
                </p>

                {/* Apply Button */}
                <Button 
                  asChild 
                  className="w-full mt-auto"
                  variant="default"
                >
                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                    Apply Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableWrapper>

      {/* Empty State */}
      {jobs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No open positions</p>
          <p className="text-sm">Check back later for new opportunities.</p>
        </div>
      )}
    </SectionContainer>
  );
}

export default CareersSection;
