-- Create homepage entry in pages table
INSERT INTO public.pages (
  title,
  slug,
  content,
  meta_description,
  is_published,
  is_default_homepage,
  language,
  template
) VALUES (
  'Home - HostOnce',
  '/',
  '<div class="homepage-content">
    <h1>Hosting Everything Without Limits</h1>
    <p>Power up your projects with next-generation hosting solutions. Enjoy maximum flexibility, unlimited bandwidth, and blazing-fast performance.</p>
    
    <div class="features">
      <div class="feature">
        <h3>100% Uptime Guarantee</h3>
        <p>Your website stays online 24/7 with our reliable infrastructure.</p>
      </div>
      <div class="feature">
        <h3>Unlimited Bandwidth</h3>
        <p>Handle any amount of traffic without additional costs.</p>
      </div>
      <div class="feature">
        <h3>Free DDoS Protection</h3>
        <p>Advanced security measures to protect your website.</p>
      </div>
      <div class="feature">
        <h3>24/7 Expert Support</h3>
        <p>Get help whenever you need it from our technical experts.</p>
      </div>
    </div>
    
    <div class="pricing">
      <h2>Starting at $3.29/mo</h2>
      <p>Save 40% on all hosting plans</p>
    </div>
  </div>',
  'Professional web hosting services with 100% uptime guarantee, unlimited bandwidth, and 24/7 support. Get started with hosting that scales with your business.',
  true,
  true,
  'en',
  'default'
);