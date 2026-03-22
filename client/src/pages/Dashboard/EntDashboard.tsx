import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getChallenges, Challenge } from '@/services/challengeService';
import { createIdea, getMyIdeas, Idea } from '@/services/ideaService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge';
import { Rocket, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const EntDashboard = () => {
    const { user } = useAuth();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [myIdeas, setMyIdeas] = useState<Idea[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Submission Form State
    const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [ideaForm, setIdeaForm] = useState({
        title: '',
        description: '',
        techStack: '',
        cost: '',
        impact: ''
    });

    const fetchData = async () => {
        try {
            const [challengesData, ideasData] = await Promise.all([
                getChallenges(),
                getMyIdeas()
            ]);
            setChallenges(challengesData);
            setMyIdeas(ideasData);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedChallenge) return;

        try {
            await createIdea({
                ...ideaForm,
                cost: Number(ideaForm.cost),
                challengeId: selectedChallenge
            });
            toast.success('Idea submitted successfully!');
            setIsDialogOpen(false);
            setIdeaForm({ title: '', description: '', techStack: '', cost: '', impact: '' });
            fetchData(); // Refresh list
        } catch (error) {
            toast.error('Failed to submit idea');
        }
    };

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
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Entrepreneur Dashboard</h1>
                        <p className="text-muted-foreground">Find challenges and submit your innovative solutions.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="font-medium">{user?.username}</p>
                            <p className="text-sm text-muted-foreground">{user?.organization}</p>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="challenges" className="w-full">
                    <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                        <TabsTrigger value="challenges">Open Challenges</TabsTrigger>
                        <TabsTrigger value="my-ideas">My Submissions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="challenges" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {challenges.map((challenge) => (
                                <Card key={challenge._id} className="flex flex-col h-full hover:shadow-lg transition-all">
                                    <CardHeader>
                                        <span className="inline-block w-fit px-2 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-medium mb-2">
                                            {challenge.sector}
                                        </span>
                                        <CardTitle className="text-xl">{challenge.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {challenge.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-muted-foreground">Department: {challenge.department}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Dialog open={isDialogOpen && selectedChallenge === challenge._id} onOpenChange={(open) => {
                                            setIsDialogOpen(open);
                                            if (open) setSelectedChallenge(challenge._id);
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button className="w-full group">
                                                    <Rocket className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                    Submit Solution
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Submit Solution for: {challenge.title}</DialogTitle>
                                                </DialogHeader>
                                                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Input
                                                            placeholder="Solution Title"
                                                            value={ideaForm.title}
                                                            onChange={(e) => setIdeaForm({ ...ideaForm, title: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Textarea
                                                            placeholder="Describe your solution..."
                                                            className="min-h-[100px]"
                                                            value={ideaForm.description}
                                                            onChange={(e) => setIdeaForm({ ...ideaForm, description: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Input
                                                            placeholder="Tech Stack Used (e.g., React, AI, Blockchain)"
                                                            value={ideaForm.techStack}
                                                            onChange={(e) => setIdeaForm({ ...ideaForm, techStack: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Input
                                                                type="number"
                                                                placeholder="Estimated Cost ($)"
                                                                value={ideaForm.cost}
                                                                onChange={(e) => setIdeaForm({ ...ideaForm, cost: e.target.value })}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Input
                                                                placeholder="Expected Impact"
                                                                value={ideaForm.impact}
                                                                onChange={(e) => setIdeaForm({ ...ideaForm, impact: e.target.value })}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button type="submit" className="w-full">Submit Proposal</Button>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="my-ideas" className="mt-6">
                        {myIdeas.length === 0 ? (
                            <div className="text-center py-20 bg-muted/20 rounded-lg">
                                <p className="text-muted-foreground">You haven't submitted any ideas yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myIdeas.map((idea) => (
                                    <Card key={idea._id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-lg">{idea.title}</h3>
                                                <Badge variant="outline" className={getStatusColor(idea.status)}>
                                                    {idea.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                For Challenge: <span className="font-medium text-foreground">{(idea.challengeId as any)?.title || 'Unknown'}</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Submitted on: {new Date(idea.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex items-center gap-4">
                                            <Button variant="outline" size="sm">View Details</Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default EntDashboard;
