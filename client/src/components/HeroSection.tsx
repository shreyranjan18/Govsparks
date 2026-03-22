import { ArrowRight, Landmark, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[80px] animate-pulse delay-300" />

      {/* Content */}
      <div className="container relative z-10 px-6 pt-32 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              Public-Private Innovation Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-up delay-100">
            Where{' '}
            <span className="text-gradient">Governance</span>
            <br />
            Meets{' '}
            <span className="text-gradient">Innovation</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-up delay-200 leading-relaxed">
            Bridging the gap between government challenges and entrepreneurial solutions.
            Together, we co-create the future of public services.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up delay-300">
            <Link to="/register">
              <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                <Landmark className="w-5 h-5 mr-2" />
                Continue as Government
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto group">
                <Lightbulb className="w-5 h-5 mr-2" />
                Continue as Entrepreneur
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-muted-foreground animate-fade-up delay-400">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-medium"
                  >
                    {['G', 'M', 'S', 'T'][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm">50+ Government Partners</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">2,500+</span>
              <span className="text-sm">Solutions Submitted</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">$12M+</span>
              <span className="text-sm">In Awarded Contracts</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-muted-foreground/50 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
