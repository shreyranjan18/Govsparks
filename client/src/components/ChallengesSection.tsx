import { useEffect, useState } from 'react';
import { Calendar, DollarSign, Users, ArrowRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getChallenges, Challenge } from '@/services/challengeService';

interface ChallengeCardProps extends Challenge { }

const ChallengeCard = ({
  _id,
  title,
  department,
  sector,
  description,
  status,
  createdAt // using createdAt as proxy for deadline logic for now
}: ChallengeCardProps) => {

  const statusMap = {
    'open': { label: 'Active', variant: 'success' },
    'closed': { label: 'Closed', variant: 'warning' }
  }

  // @ts-ignore
  const statusConfig = statusMap[status] || { label: 'Active', variant: 'success' };

  return (
    <Link to={`/challenge/${_id}`} className="block h-full">
      <div className="glass-card-hover p-6 group cursor-pointer h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="text-lg font-bold text-primary">
                {department.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{department}</p>
              <Badge variant="glass" className="mt-1">
                {sector}
              </Badge>
            </div>
          </div>
          {/* @ts-ignore */}
          <Badge variant={statusConfig.variant}>
            {statusConfig.label}
          </Badge>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm mt-auto">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-accent" />
            <span>Posted: {new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action */}
        <Button variant="glass" className="w-full group/btn mt-auto">
          View Challenge
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </Link>
  );
};

const ChallengesSection = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await getChallenges();
        setChallenges(data.slice(0, 3)); // Show top 3
      } catch (error) {
        console.error("Failed to fetch challenges", error);
      }
    }
    fetchChallenges();
  }, []);

  return (
    <section id="challenges" className="py-24 relative">
      <div className="container px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="glass" className="mb-4">
            Active Challenges
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Real Problems,{' '}
            <span className="text-gradient">Real Impact</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Government organizations post their most pressing challenges.
            Entrepreneurs and innovators compete to deliver breakthrough solutions.
          </p>
        </div>

        {/* Challenge Cards */}
        {challenges.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {challenges.map((challenge, index) => (
              <div
                key={challenge._id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ChallengeCard {...challenge} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mb-12">
            <p className="text-muted-foreground">No active challenges at the moment.</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          {/* Ideally links to a full list page */}
          <Link to="/login">
            <Button variant="heroOutline" size="lg">
              Browse All Challenges
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
