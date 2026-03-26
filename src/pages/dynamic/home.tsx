// Dynamic Home Component - Professional hosting landing page
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, DollarSign, Shield, Settings, Check, Star, MessageSquare, ArrowRight } from 'lucide-react';

const DynamicHome = () => {
  const [headerImage, setHeaderImage] = useState<string>('/lovable-uploads/50dd7b41-18c0-4d53-9a51-4f9780b9d2c7.png');

  useEffect(() => {
    // Fetch the header image from the database
    const fetchHeaderImage = async () => {
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('header_image_url')
          .or('page_url.eq./,page_url.eq.')
          .eq('is_active', true)
          .single();
        
        if (!error && data?.header_image_url) {
          setHeaderImage(data.header_image_url);
        }
      } catch (error) {
        console.error('Error fetching header image:', error);
      }
    };

    fetchHeaderImage();

    // Set up real-time subscription for header image updates
    const subscription = supabase
      .channel('pages_header_image')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'pages',
        filter: 'page_url=eq./ OR page_url=eq.',
      }, (payload) => {
        if (payload.new?.header_image_url) {
          setHeaderImage(payload.new.header_image_url);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const features = [
    { text: "100% Uptime Guarantee" },
    { text: "Enjoy Unlimited Bandwidth" },
    { text: "Free DDoS Protection" },
    { text: "24/7 Expert Support" }
  ];

  const providers = [
    { name: "Ultrahost", price: "$3.29/mo", logo: "U", active: true },
    { name: "DreamHost", price: "$4.95/mo", logo: "D" },
    { name: "HostGator", price: "$11.95/mo", logo: "H" },
    { name: "Bluehost", price: "$10.99/mo", logo: "B" },
    { name: "SiteGround", price: "$19.99/mo", logo: "S" }
  ];

  const companies = [
    "NGA", "Forbes", "techradar", "HubSpot", "cybernews", 
    "crypto.com", "WEBSITE PLANET", "NP digital", "PC", "CNET"
  ];

  return (
    <PageLayout>
      {/* Flash Sale Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-medium">Flash Sale: Get 40% Off All Hosting Services</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Hosting Everything
                  <br />
                  <span className="text-primary">Without Limits</span>
                </h1>
                
                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-foreground font-medium text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-muted-foreground">Starting at</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl lg:text-5xl font-bold text-foreground">$3.29</span>
                  <span className="text-muted-foreground">/mo*</span>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Save 40%
                  </Badge>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="px-8">
                  Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="px-8">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Try UltraAI
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Get Started Risk-free 30 Day Money-back Guarantee</span>
              </div>
            </div>

            {/* Right Content */}
            <div className="relative">
              {/* Main Person Image */}
              <div className="relative">
                <img 
                  src={headerImage} 
                  alt="Friendly hosting expert" 
                  className="w-full max-w-md mx-auto rounded-2xl"
                />
                
                {/* Reviews Badge */}
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs font-semibold">People Say "Excellent"</p>
                  <p className="text-xs text-muted-foreground">Based on 2,000+ reviews</p>
                </div>

                {/* UltraAI Chat Box */}
                <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg max-w-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-semibold text-sm">Introducing UltraAI</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Your domain and hosting advisor.</p>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded p-2">
                    <input 
                      type="text" 
                      placeholder="Ask anything" 
                      className="w-full bg-transparent text-xs outline-none"
                      readOnly
                    />
                  </div>
                </div>

                {/* Provider Comparison */}
                <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                  <div className="space-y-2">
                    {providers.map((provider, index) => (
                      <div key={provider.name} className="flex items-center gap-3 text-xs">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold ${
                          provider.active ? 'bg-blue-500' : 'bg-gray-400'
                        }`}>
                          {provider.logo}
                        </div>
                        <span className="flex-1">{provider.name}</span>
                        <span className="font-semibold">{provider.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-12 items-center">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">G</div>
              </div>
              <div className="flex justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="font-bold">Rated 4.9</p>
              <p className="text-xs text-muted-foreground">300+ Reviews</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">★</div>
              </div>
              <div className="flex justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="font-bold">Rated 4.9</p>
              <p className="text-xs text-muted-foreground">1000+ Reviews</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">★</div>
              </div>
              <div className="flex justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="font-bold">Rated 4.9</p>
              <p className="text-xs text-muted-foreground">1,704 Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {companies.map((company, index) => (
              <div key={index} className="text-muted-foreground font-semibold text-sm">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default DynamicHome;