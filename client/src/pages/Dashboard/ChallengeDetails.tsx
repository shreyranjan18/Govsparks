import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getChallengeById, Challenge } from '@/services/challengeService';
import { getIdeasForChallenge, Idea } from '@/services/ideaService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getComments } from '@/services/commentService';
import { toast } from 'sonner';

// Ideally added to services
import api from '@/services/api';

// Temporary helper until I add it to service properly or export it
const getIdeas = async (challengeId: string) => {
    const response = await api.get<Idea[]>(`/ideas/challenge/${challengeId}`);
    return response.data;
}

const ChallengeDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                // Fetch Challenge logic - currently simplistic in service, need BY ID
                // I need to add getChallengeById to frontend service first if not present
                // I will assume simple fetching for now or add it
                const res = await api.get(`/challenges/${id}`);
                setChallenge(res.data);

                const ideasData = await getIdeas(id);
                setIdeas(ideasData);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load details');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (!challenge) return <div className="p-8">Challenge not found</div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'under review': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            default: return 'bg-primary/10 text-primary border-primary/20';
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col gap-4">
                    <Link to="/dashboard/government">
                        <Button variant="outline">← Back to Dashboard</Button>
                    </Link>
                    <h1 className="text-3xl font-bold">{challenge.title}</h1>
                    <div className="flex gap-2">
                        <Badge variant="secondary">{challenge.sector}</Badge>
                        <Badge variant="outline">{challenge.department}</Badge>
                    </div>
                    <p className="text-muted-foreground text-lg">{challenge.description}</p>
                </div>

                <div className="border-t pt-8">
                    <h2 className="text-2xl font-semibold mb-6">Submitted Solutions ({ideas.length})</h2>
                    {ideas.length === 0 ? (
                        <p className="text-muted-foreground">No solutions submitted yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ideas.map((idea) => (
                                <Card key={idea._id} className="flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge className={getStatusColor(idea.status)} variant="outline">
                                                {idea.status}
                                            </Badge>
                                        </div>
                                        <CardTitle className="line-clamp-1">{idea.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">{idea.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow space-y-2 text-sm">
                                        <div>
                                            <span className="font-semibold">Tech:</span> {idea.techStack}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Cost:</span> ${idea.cost}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Impact:</span> {idea.impact}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Link to={`/idea/${idea._id}`} className="w-full">
                                            <Button className="w-full">View Discussion & Details</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChallengeDetails;
