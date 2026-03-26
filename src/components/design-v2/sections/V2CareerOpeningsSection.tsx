import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useArrayItems } from '@/hooks/useArrayItems';
import { useJobPosts, type JobPost } from '@/hooks/useJobPosts';
import { EditableElement, EditableInline } from '@/components/editor/EditableElement';
import { ChevronDown, Search, MapPin, Clock } from 'lucide-react';

interface StaticJob {
  id: number;
  title: string;
  description: string;
  location: string;
  type: string;
}

interface StaticJobCategory {
  id: number;
  category: string;
  categoryIcon: string;
  jobs: StaticJob[];
}

interface V2CareerOpeningsSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    searchPlaceholder?: string;
    categories?: StaticJobCategory[];
    dynamic?: boolean;
  };
  sectionId?: string;
  isEditing?: boolean;
}

interface DynamicCategory {
  id: string;
  category: string;
  categoryIcon: string;
  jobs: { id: string; slug: string; title: string; description: string; location: string; type: string }[];
}

export const V2CareerOpeningsSection: React.FC<V2CareerOpeningsSectionProps> = ({ data, sectionId, isEditing }) => {
  const [expandedCategories, setExpandedCategories] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const title = data?.title ?? 'Find Suitable Openings';
  const searchPlaceholder = data?.searchPlaceholder ?? 'Search for a position';

  // Always fetch from DB unless in editor mode with dynamic=false
  const useDynamic = !isEditing || data?.dynamic !== false;
  const { data: dbPosts = [] } = useJobPosts(true);

  // Group DB posts by department
  const dynamicCategories = useMemo<DynamicCategory[]>(() => {
    if (!useDynamic || dbPosts.length === 0) return [];
    const map = new Map<string, DynamicCategory>();
    dbPosts.forEach((post) => {
      const deptId = post.department_id;
      const deptName = post.department?.name || 'Other';
      if (!map.has(deptId)) {
        map.set(deptId, {
          id: deptId,
          category: deptName,
          categoryIcon: post.department?.icon_url || '',
          jobs: [],
        });
      }
      map.get(deptId)!.jobs.push({
        id: post.id,
        slug: post.slug,
        title: post.title,
        description: post.about_the_role?.split('\n')[0] || '',
        location: post.location_type === 'remote' ? 'Remote' : post.location_country || post.location_type,
        type: post.commitment_type === 'custom' ? post.commitment_custom || 'Custom' : post.commitment_type.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      });
    });
    return Array.from(map.values());
  }, [useDynamic, dbPosts]);

  // Fall back to static data for editor
  const { items: staticCategories, getItemProps, SortableWrapper } = useArrayItems<StaticJobCategory>(
    'categories',
    data?.categories ?? []
  );

  const isDynamic = useDynamic && dynamicCategories.length > 0;
  const totalJobs = isDynamic
    ? dbPosts.length
    : staticCategories.reduce((sum, c) => sum + c.jobs.length, 0);

  const subtitle = data?.subtitle ?? `${totalJobs} Openings Currently`;

  const toggleCategory = (categoryId: string | number) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  // Auto-expand first category
  React.useEffect(() => {
    if (isDynamic && dynamicCategories.length > 0 && expandedCategories.length === 0) {
      setExpandedCategories([dynamicCategories[0].id]);
    } else if (!isDynamic && staticCategories.length > 0 && expandedCategories.length === 0) {
      setExpandedCategories([staticCategories[0]?.id]);
    }
  }, [isDynamic, dynamicCategories, staticCategories]);

  const filteredDynamic = useMemo(() => {
    if (!searchQuery.trim()) return dynamicCategories;
    const q = searchQuery.toLowerCase();
    return dynamicCategories
      .map(cat => ({ ...cat, jobs: cat.jobs.filter(j => j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q)) }))
      .filter(cat => cat.jobs.length > 0 || cat.category.toLowerCase().includes(q));
  }, [dynamicCategories, searchQuery]);

  const filteredStatic = useMemo(() => {
    if (!searchQuery.trim()) return staticCategories;
    const q = searchQuery.toLowerCase();
    return staticCategories
      .map(cat => ({ ...cat, jobs: cat.jobs.filter(j => j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q)) }))
      .filter(cat => cat.jobs.length > 0 || cat.category.toLowerCase().includes(q));
  }, [staticCategories, searchQuery]);

  // If dynamic and no posts, hide entire section
  if (isDynamic && dbPosts.length === 0 && !isEditing) return null;

  return (
    <section className="w-full relative bg-colors-neutral-25" aria-labelledby="v2-career-openings-heading">
      <div className="w-full max-w-[1920px] mx-auto flex flex-col items-center gap-8 md:gap-10 py-10 md:py-[60px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-[120px]">
        <header className="flex flex-col items-center gap-4 w-full text-center">
          <EditableElement
            as="h2"
            id="v2-career-openings-heading"
            sectionId={sectionId}
            path="title"
            className="font-heading-h2 font-[number:var(--heading-h2-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h2-font-size)] tracking-[var(--heading-h2-letter-spacing)] leading-[var(--heading-h2-line-height)]"
          >
            {title}
          </EditableElement>
          <EditableInline sectionId={sectionId} path="subtitle" className="font-body-regular text-colors-neutral-600">
            {isDynamic ? `${totalJobs} Openings Currently` : subtitle}
          </EditableInline>
        </header>

        <div className="flex items-center gap-3 w-full max-w-[400px] h-12 px-4 bg-colors-neutral-25 rounded-full border border-colors-translucent-dark-16">
          <Search className="w-4 h-4 text-colors-neutral-400 shrink-0" />
          <input
            className="flex-1 bg-transparent border-none outline-none font-body-small text-colors-neutral-600 placeholder:text-colors-neutral-400"
            placeholder={searchPlaceholder}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isDynamic ? (
          <div className="flex flex-col w-full gap-4 md:gap-8">
            {filteredDynamic.map((category) => {
              const isExpanded = expandedCategories.includes(category.id);
              return (
                <div key={category.id} className="flex flex-col w-full gap-4 md:gap-8">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center justify-between w-full cursor-pointer hover:opacity-80 transition-opacity"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      {category.categoryIcon && <img className="w-10 h-10" alt="" src={category.categoryIcon} />}
                      <div className="flex items-center gap-3">
                        <h3 className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)]">
                          {category.category}
                        </h3>
                        <span className="text-colors-neutral-600 font-body-regular">
                          {category.jobs.length} Open Roles
                        </span>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-colors-neutral-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isExpanded && category.jobs.length > 0 && (
                    <div className="flex flex-col gap-4 w-full lg:pl-[228px]">
                      {category.jobs.map((job) => (
                        <article key={job.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-6 bg-colors-neutral-25 rounded-3xl border border-colors-translucent-dark-8 shadow-[0px_0px_40px_#0000000a]">
                          <div className="flex flex-col gap-4 md:gap-6 flex-1">
                            <div className="flex flex-col gap-1">
                              <Link to={`/careers/${job.slug}`} className="hover:underline">
                                <h4 className="font-body-extra-large-m font-[number:var(--body-extra-large-m-font-weight)] text-colors-neutral-800 text-[length:var(--body-extra-large-m-font-size)]">
                                  {job.title}
                                </h4>
                              </Link>
                              <p className="font-body-regular text-colors-neutral-600 line-clamp-2">{job.description}</p>
                            </div>
                            <div className="flex items-center gap-4 text-colors-neutral-600 text-sm">
                              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{job.location}</span>
                              <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{job.type}</span>
                            </div>
                          </div>
                          <Link
                            to={`/careers/${job.slug}`}
                            className="inline-flex items-center justify-center gap-2 py-3 px-8 bg-colors-neutral-800 rounded-2xl text-colors-neutral-25 font-body-regular-b whitespace-nowrap hover:opacity-90 transition-opacity shrink-0"
                          >
                            Apply
                          </Link>
                        </article>
                      ))}
                    </div>
                  )}

                  <div className="w-full h-px bg-colors-translucent-dark-8" role="separator" />
                </div>
              );
            })}
          </div>
        ) : (
          <SortableWrapper>
            <div className="flex flex-col w-full gap-4 md:gap-8">
              {filteredStatic.map((category, catIndex) => {
                const isExpanded = expandedCategories.includes(category.id);
                return (
                  <div key={category.id} {...getItemProps(catIndex)} className="flex flex-col w-full gap-4 md:gap-8">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex items-center justify-between w-full cursor-pointer hover:opacity-80 transition-opacity"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <img className="w-10 h-10" alt="" src={category.categoryIcon} />
                        <div className="flex items-center gap-3">
                          <h3 className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-colors-neutral-800 text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)]">
                            {category.category}
                          </h3>
                          <span className="text-colors-neutral-600 font-body-regular">
                            {category.jobs.length} Open Roles
                          </span>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-colors-neutral-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {isExpanded && category.jobs.length > 0 && (
                      <div className="flex flex-col gap-4 w-full lg:pl-[228px]">
                        {category.jobs.map((job) => (
                          <article key={job.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-6 bg-colors-neutral-25 rounded-3xl border border-colors-translucent-dark-8 shadow-[0px_0px_40px_#0000000a]">
                            <div className="flex flex-col gap-4 md:gap-6 flex-1">
                              <div className="flex flex-col gap-1">
                                <h4 className="font-body-extra-large-m font-[number:var(--body-extra-large-m-font-weight)] text-colors-neutral-800 text-[length:var(--body-extra-large-m-font-size)]">
                                  {job.title}
                                </h4>
                                <p className="font-body-regular text-colors-neutral-600">{job.description}</p>
                              </div>
                              <div className="flex items-center gap-4 text-colors-neutral-600 text-sm">
                                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{job.location}</span>
                                <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{job.type}</span>
                              </div>
                            </div>
                            <button className="inline-flex items-center justify-center gap-2 py-3 px-8 bg-colors-neutral-800 rounded-2xl text-colors-neutral-25 font-body-regular-b whitespace-nowrap hover:opacity-90 transition-opacity shrink-0">
                              Apply
                            </button>
                          </article>
                        ))}
                      </div>
                    )}

                    <div className="w-full h-px bg-colors-translucent-dark-8" role="separator" />
                  </div>
                );
              })}
            </div>
          </SortableWrapper>
        )}
      </div>
    </section>
  );
};

export default V2CareerOpeningsSection;
