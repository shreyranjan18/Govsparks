import { FileText, MessageSquare, Award, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: FileText,
      title: 'Post a Challenge',
      description: 'Government organizations define real-world problems, set criteria, and specify rewards for successful solutions.',
      color: 'primary',
    },
    {
      icon: MessageSquare,
      title: 'Submit Solutions',
      description: 'Entrepreneurs and innovators develop and submit their proposals, competing to solve the challenge.',
      color: 'accent',
    },
    {
      icon: Award,
      title: 'Review & Award',
      description: 'Expert panels evaluate submissions. Winners receive funding, contracts, or pilot opportunities.',
      color: 'primary',
    },
    {
      icon: CheckCircle2,
      title: 'Implement & Scale',
      description: 'Winning solutions are implemented, refined through collaboration, and scaled for public benefit.',
      color: 'accent',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container px-6 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="glass" className="mb-4">
            The Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            From Problem to{' '}
            <span className="text-gradient">Prototype</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A transparent, efficient workflow that connects government needs 
            with entrepreneurial solutions in weeks, not years.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-px bg-gradient-to-r from-border to-transparent" />
              )}

              {/* Step Card */}
              <div className="glass-card-hover p-6 text-center h-full">
                {/* Step Number */}
                <div className="absolute -top-3 left-6 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center transition-transform group-hover:scale-110 ${
                    step.color === 'primary'
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-accent/10 border border-accent/20'
                  }`}
                >
                  <step.icon
                    className={`w-8 h-8 ${
                      step.color === 'primary' ? 'text-primary' : 'text-accent'
                    }`}
                  />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
