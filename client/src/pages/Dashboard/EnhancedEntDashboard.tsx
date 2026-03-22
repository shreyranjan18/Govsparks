import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getChallenges, Challenge } from '@/services/challengeService';
import { createIdea, getMyIdeas, Idea } from '@/services/ideaService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, TrendingUp, Award, Rocket, Star, Send, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { VerificationBadge } from '@/components/VerificationBadge';
import api from '@/services/api';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const EnhancedEntDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [myIdeas, setMyIdeas] = useState<Idea[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState<string>('');
    const [newIdea, setNewIdea] = useState({
        title: '',
        description: '',
        techStack: '',
        cost: 0,
        impact: '',
        challengeId: ''
    });

    const fetchData = async () => {
        try {
            const [challengesData, ideasData, analyticsData] = await Promise.all([
                getChallenges(),
                getMyIdeas(),
                api.get('/analytics/dashboard')
            ]);
            setChallenges(challengesData);
            setMyIdeas(ideasData);
            setAnalytics(analyticsData.data);
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

    const handleSubmitIdea = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createIdea({ ...newIdea, challengeId: selectedChallenge });
            toast.success('Idea submitted successfully');
            setNewIdea({ title: '', description: '', techStack: '', cost: 0, impact: '', challengeId: '' });
            setSelectedChallenge('');
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            toast.error('Failed to submit idea');
        }
    };

    const getStatusIcon = (status: string) => {
        const icons: Record<string, any> = {
            'submitted': <Clock className="w-4 h-4 text-blue-500" />,
            'under review': <TrendingUp className="w-4 h-4 text-yellow-500" />,
            'shortlisted': <Star className="w-4 h-4 text-purple-500" />,
            'pilot': <Rocket className="w-4 h-4 text-teal-500" />,
            'approved': <CheckCircle2 className="w-4 h-4 text-green-500" />,
            'rejected': <XCircle className="w-4 h-4 text-red-500" />
        };
        return icons[status] || <Clock className="w-4 h-4" />;
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'submitted': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            'under review': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            'shortlisted': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
            'pilot': 'bg-teal-500/10 text-teal-500 border-teal-500/20',
            'approved': 'bg-green-500/10 text-green-500 border-green-500/20',
            'rejected': 'bg-red-500/10 text-red-500 border-red-500/20'
        };
        return colors[status] || 'bg-gray-500/10 text-gray-500';
    };

    const getProgressPercentage = (status: string) => {
        const progress: Record<string, number> = {
            'submitted': 16,
            'under review': 33,
            'shortlisted': 50,
            'pilot': 75,
            'approved': 100,
            'rejected': 0
        };
        return progress[status] || 0;
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight">Entrepreneur Dashboard</h1>
                            <VerificationBadge isVerified={user?.isVerified || false} type="entrepreneur" />
                        </div>
                        <p className="text-muted-foreground">Track your submissions and discover new opportunities.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="font-medium">{user?.username}</p>
                            <p className="text-sm text-muted-foreground">{user?.organization}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Analytics Stats Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <motion.div variants={item}>
                        <Card className="glass-card-hover">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                                <Lightbulb className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    <AnimatedCounter value={analytics?.totalSubmissions || myIdeas.length} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Ideas submitted</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card className="glass-card-hover">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg Quality Score</CardTitle>
                                <Star className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-yellow-500">
                                    <AnimatedCounter
                                        value={parseFloat(analytics?.avgQualityScore || '0')}
                                        decimals={1}
                                        suffix="/5"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">From government reviews</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card className="glass-card-hover">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Pilots</CardTitle>
                                <Rocket className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-teal-500">
                                    <AnimatedCounter value={analytics?.activePilots || 0} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">In progress</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card className="glass-card-hover">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                                <Award className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-500">
                                    <AnimatedCounter value={analytics?.statusBreakdown?.approved || 0} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Success rate</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Tabs */}
                <Tabs defaultValue="challenges" className="w-full">
                    <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                        <TabsTrigger value="challenges">Open Challenges</TabsTrigger>
                        <TabsTrigger value="submissions">My Submissions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="challenges" className="mt-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Available Challenges</h2>
                            <Badge variant="outline">{challenges.filter(c => c.status === 'open').length} Open</Badge>
                        </div>

                        {isLoading ? (
                            <p>Loading challenges...</p>
                        ) : (
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {challenges.filter(c => c.status === 'open').map((challenge: any) => (
                                    <motion.div key={challenge._id} variants={item}>
                                        <Card className="group relative overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
                                            <CardHeader>
                                                <div className="flex justify-between items-start mb-2">
                                                    <Badge variant="glass">{challenge.sector}</Badge>
                                                    {challenge.engagementScore > 50 && (
                                                        <Badge variant="default" className="text-xs">Hot 🔥</Badge>
                                                    )}
                                                </div>
                                                <CardTitle className="line-clamp-1">{challenge.title}</CardTitle>
                                                <CardDescription className="line-clamp-2">
                                                    {challenge.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex-grow">
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Department:</span>
                                                        <span className="font-medium text-xs">{challenge.department}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Submissions:</span>
                                                        <span className="font-medium">{challenge.submissionCount || 0}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            className="w-full group/btn"
                                                            onClick={() => setSelectedChallenge(challenge._id)}
                                                        >
                                                            <Send className="w-4 h-4 mr-2 group-hover/btn:translate-x-1 transition-transform" />
                                                            Submit Solution
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>Submit Your Solution</DialogTitle>
                                                        </DialogHeader>
                                                        <form onSubmit={handleSubmitIdea} className="space-y-4 py-4">
                                                            <Input
                                                                placeholder="Solution Title"
                                                                value={newIdea.title}
                                                                onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                                                                required
                                                            />
                                                            <Textarea
                                                                placeholder="Detailed Description"
                                                                className="min-h-[120px]"
                                                                value={newIdea.description}
                                                                onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                                                                required
                                                            />
                                                            <Input
                                                                placeholder="Technology Stack (e.g., React, Node.js, MongoDB)"
                                                                value={newIdea.techStack}
                                                                onChange={(e) => setNewIdea({ ...newIdea, techStack: e.target.value })}
                                                                required
                                                            />
                                                            <Input
                                                                type="number"
                                                                placeholder="Estimated Cost (USD)"
                                                                value={newIdea.cost || ''}
                                                                onChange={(e) => setNewIdea({ ...newIdea, cost: parseInt(e.target.value) || 0 })}
                                                                required
                                                            />
                                                            <Textarea
                                                                placeholder="Expected Impact"
                                                                className="min-h-[80px]"
                                                                value={newIdea.impact}
                                                                onChange={(e) => setNewIdea({ ...newIdea, impact: e.target.value })}
                                                                required
                                                            />
                                                            <Button type="submit" className="w-full">Submit Idea</Button>
                                                        </form>
                                                    </DialogContent>
                                                </Dialog>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </TabsContent>

                    <TabsContent value="submissions" className="mt-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">My Submissions</h2>
                            <Badge variant="outline">{myIdeas.length} Total</Badge>
                        </div>

                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="space-y-4"
                        >
                            {myIdeas.map((idea) => (
                                <motion.div key={idea._id} variants={item}>
                                    <Card
                                        className="group cursor-pointer hover:shadow-lg transition-all"
                                        onClick={() => navigate(`/idea/${idea._id}`)}
                                    >
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <CardTitle className="mb-2">{idea.title}</CardTitle>
                                                    <CardDescription className="line-clamp-2">
                                                        {idea.description}
                                                    </CardDescription>
                                                </div>
                                                <Badge className={`${getStatusColor(idea.status)} border flex items-center gap-1`}>
                                                    {getStatusIcon(idea.status)}
                                                    {idea.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground mb-1">Challenge</p>
                                                    <p className="font-medium line-clamp-1">
                                                        {typeof idea.challengeId === 'object' ? idea.challengeId.title : 'N/A'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground mb-1">Cost</p>
                                                    <p className="font-medium">${idea.cost.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground mb-1">Quality Score</p>
                                                    <p className="font-medium flex items-center gap-1">
                                                        {idea.qualityScore ? (
                                                            <>
                                                                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                                {idea.qualityScore.toFixed(1)}/5
                                                            </>
                                                        ) : (
                                                            <span className="text-muted-foreground">Not rated</span>
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground mb-1">Submitted</p>
                                                    <p className="font-medium text-xs">
                                                        {new Date(idea.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">Progress</span>
                                                    <span className="font-medium">{getProgressPercentage(idea.status)}%</span>
                                                </div>
                                                <Progress value={getProgressPercentage(idea.status)} className="h-2" />
                                            </div>

                                            {idea.isPilotActive && (
                                                <Badge variant="default" className="bg-teal-500">
                                                    <Rocket className="w-3 h-3 mr-1" />
                                                    Pilot Program Active
                                                </Badge>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}

                            {myIdeas.length === 0 && (
                                <Card className="p-12">
                                    <div className="text-center">
                                        <Lightbulb className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                        <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Start by submitting solutions to open challenges
                                        </p>
                                        <Button onClick={() => document.querySelector<HTMLButtonElement>('[value="challenges"]')?.click()}>
                                            Browse Challenges
                                        </Button>
                                    </div>
                                </Card>
                            )}
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default EnhancedEntDashboard;
