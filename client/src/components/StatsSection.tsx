import { useEffect, useState, useRef } from 'react';
import { TrendingUp, Users, Building2, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatItemProps {
  icon: React.ElementType;
  value: number;
  suffix?: string;
  label: string;
  delay: number;
}

const StatItem = ({ icon: Icon, value, suffix = '', label, delay }: StatItemProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, value, delay]);

  return (
    <div ref={ref} className="glass-card-hover p-8 text-center group">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
        {count.toLocaleString()}
        <span className="text-primary">{suffix}</span>
      </div>
      <p className="text-muted-foreground text-sm uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
};

const StatsSection = () => {
  const stats = [
    {
      icon: Building2,
      value: 150,
      suffix: '+',
      label: 'Government Partners',
      delay: 0,
    },
    {
      icon: Users,
      value: 12500,
      suffix: '+',
      label: 'Registered Innovators',
      delay: 100,
    },
    {
      icon: Trophy,
      value: 340,
      suffix: '',
      label: 'Challenges Completed',
      delay: 200,
    },
    {
      icon: TrendingUp,
      value: 48,
      suffix: 'M',
      label: 'Total Value Awarded',
      delay: 300,
    },
  ];

  return (
    <section id="impact" className="py-24 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container px-6 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="glass" className="mb-4">
            Our Impact
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Measurable{' '}
            <span className="text-gradient">Results</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Driving innovation at scale through transparent collaboration 
            between the public and private sectors.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
