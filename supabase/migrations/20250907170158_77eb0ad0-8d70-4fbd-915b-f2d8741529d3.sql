-- Update homepage content with comprehensive sections
UPDATE public.pages 
SET content = '<!-- Flash Sale Banner -->
<div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3">
  <div class="container mx-auto px-4 text-center">
    <div class="flex items-center justify-center gap-2">
      <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      <span class="font-medium">Flash Sale Get 40% Off All Hosting Services</span>
    </div>
  </div>
</div>

<!-- Hero Section -->
<section class="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
  <div class="container mx-auto px-4">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <!-- Left Content -->
      <div class="space-y-8">
        <div class="space-y-6">
          <h1 class="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
            Hosting Everything<br>
            <span class="text-primary">Without Limits</span>
          </h1>
          
          <!-- Features Grid -->
          <div class="grid sm:grid-cols-2 gap-4 mt-8">
            <div class="flex items-center gap-3">
              <div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span class="text-foreground font-medium text-sm">100% Uptime Guarantee</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span class="text-foreground font-medium text-sm">Enjoy Unlimited Bandwidth</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span class="text-foreground font-medium text-sm">Free DDoS Protection</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span class="text-foreground font-medium text-sm">24/7 Expert Support</span>
            </div>
          </div>
        </div>

        <!-- Pricing -->
        <div class="space-y-4">
          <div class="flex items-baseline gap-2">
            <span class="text-muted-foreground">Starting at</span>
          </div>
          <div class="flex items-baseline gap-3">
            <span class="text-4xl lg:text-5xl font-bold text-foreground">$3.29</span>
            <span class="text-muted-foreground">/mo*</span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Save 40%
            </span>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button class="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90">
            Get Started Now →
          </button>
          <button class="inline-flex items-center justify-center px-8 py-3 text-sm font-medium border border-input rounded-md hover:bg-accent">
            💬 Try UltraAI
          </button>
        </div>
        
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          <span>Get Started Risk-free 30 Day Money-back Guarantee</span>
        </div>
      </div>

      <!-- Right Content -->
      <div class="relative">
        <img 
          src="/lovable-uploads/591a11dc-e7a7-4675-933c-511008112348.png" 
          alt="Hosting Everything Without Limits - Professional hosting services" 
          class="w-full max-w-md mx-auto rounded-2xl"
        />
      </div>
    </div>
  </div>
</section>

<!-- Reviews Section -->
<section class="py-12 bg-white dark:bg-gray-900">
  <div class="container mx-auto px-4">
    <div class="flex justify-center gap-12 items-center">
      <div class="text-center">
        <div class="flex items-center justify-center gap-1 mb-1">
          <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">G</div>
        </div>
        <div class="flex justify-center mb-1">
          <span class="text-yellow-400">★★★★★</span>
        </div>
        <p class="font-bold">Rated 4.9</p>
        <p class="text-xs text-muted-foreground">300+ Reviews</p>
      </div>
      
      <div class="text-center">
        <div class="flex items-center justify-center gap-1 mb-1">
          <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">★</div>
        </div>
        <div class="flex justify-center mb-1">
          <span class="text-yellow-400">★★★★★</span>
        </div>
        <p class="font-bold">Rated 4.9</p>
        <p class="text-xs text-muted-foreground">1000+ Reviews</p>
      </div>
      
      <div class="text-center">
        <div class="flex items-center justify-center gap-1 mb-1">
          <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">★</div>
        </div>
        <div class="flex justify-center mb-1">
          <span class="text-yellow-400">★★★★★</span>
        </div>
        <p class="font-bold">Rated 4.9</p>
        <p class="text-xs text-muted-foreground">1,704 Reviews</p>
      </div>
    </div>
  </div>
</section>

<!-- Companies Section -->
<section class="py-12 bg-gray-50 dark:bg-gray-800">
  <div class="container mx-auto px-4">
    <div class="flex flex-wrap justify-center items-center gap-8 opacity-60">
      <div class="text-muted-foreground font-semibold text-sm">NGA</div>
      <div class="text-muted-foreground font-semibold text-sm">Forbes</div>
      <div class="text-muted-foreground font-semibold text-sm">techradar</div>
      <div class="text-muted-foreground font-semibold text-sm">HubSpot</div>
      <div class="text-muted-foreground font-semibold text-sm">cybernews</div>
      <div class="text-muted-foreground font-semibold text-sm">crypto.com</div>
      <div class="text-muted-foreground font-semibold text-sm">WEBSITE PLANET</div>
      <div class="text-muted-foreground font-semibold text-sm">NP digital</div>
      <div class="text-muted-foreground font-semibold text-sm">PC</div>
      <div class="text-muted-foreground font-semibold text-sm">CNET</div>
    </div>
  </div>
</section>'
WHERE page_url = '/';