UPDATE pages 
SET content = '      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  20x Faster
                  <br />
                  <span className="text-primary">VPS Hosting</span>
                </h1>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Power up your projects with next-generation VPS hosting. Enjoy 
                  maximum flexibility, unlimited bandwidth, and blazing-fast 
                  performance. Get started today and experience the difference!
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-foreground font-medium">100% Uptime Guarantee</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-foreground font-medium">Free Real-Time Snapshot</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-foreground font-medium">Free DDoS Protection</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-foreground font-medium">24/7 Expert Support</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-muted-foreground">Starting at</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl lg:text-5xl font-bold text-foreground">$4.80</span>
                  <span className="text-muted-foreground">/mo*</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    💰 Save 40%
                  </Badge>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4">
                <Button size="lg" className="w-full sm:w-auto px-8">
                  View Plans →
                </Button>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Get Started Risk-free</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  30 Day Money-back Guarantee
                </p>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative flex justify-center items-center">
              <img 
                src={pageData?.header_image_url || "/src/assets/server-icon.svg"} 
                alt="Server infrastructure" 
                className="w-96 h-96 object-contain"
              />
            </div>
          </div>
        </div>
      </section>'
WHERE page_url = '/vps-hosting'