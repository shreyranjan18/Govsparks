import { ArrowRight, Landmark, Lightbulb, Shield, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 right-1/4 w-60 h-60 bg-accent/10 rounded-full blur-[80px]" />

      <div className="container px-6 relative">
        <div className="max-w-5xl mx-auto">
          {/* Main CTA Card */}
          <div className="glass-card p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
            {/* Decorative Grid */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }} />
            </div>

            <div className="relative">
              <Badge variant="glass" className="mb-6">
                Join the Movement
              </Badge>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Ready to{' '}
                <span className="text-gradient">Transform</span>
                <br />
                Public Services?
              </h2>

              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                Whether you're a government body seeking innovative solutions or an 
                entrepreneur ready to make an impact, your journey starts here.
              </p>

              {/* Role Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                {/* Government CTA */}
                <div className="glass-card-hover p-6 text-left">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Landmark className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">For Government</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Post challenges, access innovation, and modernize public services efficiently.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {['Access to 12,500+ innovators', 'Transparent procurement', 'Fast-track implementation'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="w-4 h-4 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button variant="hero" className="w-full group">
                    Register Organization
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>

                {/* Entrepreneur CTA */}
                <div className="glass-card-hover p-6 text-left">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                    <Lightbulb className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">For Entrepreneurs</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Compete for contracts, scale your solutions, and create lasting public impact.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {['Access real-world challenges', 'Win funded contracts', 'Scale with government backing'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Zap className="w-4 h-4 text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button variant="heroOutline" className="w-full group">
                    Join as Innovator
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                <Globe className="w-4 h-4" />
                <span>Trusted by 50+ countries worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
