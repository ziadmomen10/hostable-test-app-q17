import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useJobPostBySlug } from '@/hooks/useJobPosts';
import JobApplicationForm from '@/components/careers/JobApplicationForm';
import { MapPin, Clock, ArrowLeft, Briefcase } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Section: React.FC<{ title: string; content: string }> = ({ title, content }) => {
  if (!content?.trim()) return null;
  const lines = content.split('\n').filter((l) => l.trim());
  const isList = lines.length > 1;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      {isList ? (
        <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
          {lines.map((line, i) => (
            <li key={i}>{line.replace(/^[-•*]\s*/, '')}</li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground leading-relaxed">{content}</p>
      )}
    </div>
  );
};

const JobPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useJobPostBySlug(slug);
  const [applyOpen, setApplyOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="text-2xl font-bold text-foreground">Job Not Found</h1>
        <Link to="/" className="text-primary underline">Back to Home</Link>
      </div>
    );
  }

  const locationLabel = post.location_type === 'remote'
    ? 'Remote'
    : `${post.location_type === 'onsite' ? 'Onsite' : 'Hybrid'}${post.location_country ? ` — ${post.location_country}` : ''}`;

  const commitmentLabel = post.commitment_type === 'custom'
    ? post.commitment_custom || 'Custom'
    : post.commitment_type.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const isExternal = post.apply_type === 'external' && post.apply_external_url;

  const applyButtonClasses = "inline-flex items-center justify-center gap-2 py-3 px-8 bg-primary text-primary-foreground rounded-2xl font-medium hover:opacity-90 transition-opacity";

  return (
    <>
      <Helmet>
        <title>{post.title} | Careers</title>
        <meta name="description" content={post.about_the_role?.slice(0, 160)} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="bg-muted/30 border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Careers
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Briefcase className="w-4 h-4" />
              <span>{post.department?.name}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{locationLabel}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" />{commitmentLabel}</span>
            </div>
            {isExternal ? (
              <a href={post.apply_external_url!} target="_blank" rel="noopener noreferrer" className={`mt-8 ${applyButtonClasses}`}>
                Apply Now
              </a>
            ) : (
              <button onClick={() => setApplyOpen(true)} className={`mt-8 ${applyButtonClasses}`}>
                Apply Now
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
          <Section title="About the Role" content={post.about_the_role} />
          <Section title="Key Responsibilities" content={post.key_responsibilities} />
          <Section title="Requirements" content={post.requirements} />
          <Section title="Nice to Have" content={post.nice_to_have || ''} />
          <Section title="What We Offer" content={post.what_we_offer || ''} />

          {/* Bottom CTA */}
          <div className="pt-8 border-t">
            <h2 className="text-xl font-semibold text-foreground mb-4">Ready to join us?</h2>
            {isExternal ? (
              <a href={post.apply_external_url!} target="_blank" rel="noopener noreferrer" className={applyButtonClasses}>
                Apply Now
              </a>
            ) : (
              <button onClick={() => setApplyOpen(true)} className={applyButtonClasses}>
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Internal Application Form */}
      {post.apply_type === 'internal' && (
        <JobApplicationForm
          jobPostId={post.id}
          jobTitle={post.title}
          open={applyOpen}
          onOpenChange={setApplyOpen}
        />
      )}
    </>
  );
};

export default JobPostPage;
