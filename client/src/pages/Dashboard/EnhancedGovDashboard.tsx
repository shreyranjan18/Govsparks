import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getChallenges, createChallenge, deleteChallenge, Challenge } from '@/services/challengeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Building2, TrendingUp, Users, BarChart3, Target } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { SubmissionTrendChart } from '@/components/SubmissionTrendChart';
import { SectorHeatmap } from '@/components/SectorHeatmap';
import { VerificationBadge } from '@/components/VerificationBadge';
import api from '@/services/api';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const EnhancedGovDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newChallenge, setNewChallenge] = useState({
        title: '',
        description: '',
        department: user?.organization || '',
        sector: '',
        requiresNDA: false,
        termsAndConditions: ''
    });

    const fetchData = async () => {
        try {
            const [challengesData, analyticsData] = await Promise.all([
                getChallenges(),
                api.get('/analytics/dashboard')
            ]);
            setChallenges(challengesData);
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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createChallenge(newChallenge);
            toast.success('Challenge created successfully');
            setNewChallenge({
                title: '',
                description: '',
                department: user?.organization || '',
                sector: '',
                requiresNDA: false,
                termsAndConditions: ''
            });
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            toast.error('Failed to create challenge');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this challenge?')) {
            try {
                await deleteChallenge(id);
                toast.success('Challenge deleted');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete challenge');
            }
        }
    };

    const getEngagementBadge = (score: number) => {
        if (score > 100) return { label: 'High', variant: 'default' as const };
        if (score > 50) return { label: 'Medium', variant: 'secondary' as const };
        return { label: 'Low', variant: 'outline' as const };
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
                            <h1 className="text-3xl font-bold tracking-tight">Government Dashboard</h1>
                            <VerificationBadge isVerified={user?.isVerified || false} type="government" />
                        </div>
                        <p className="text-muted-foreground">Enterprise-grade challenge management and analytics.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="font-medium">{user?.username}</p>
                            <p className="text-sm text-muted-foreground">{user?.organization}</p>
                            {user?.department && (
                                <p className="text-xs text-muted-foreground">{user.department}</p>
                            )}
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
                                <CardTitle className="text-sm font-medium">Total Challenges</CardTitle>
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    <AnimatedCounter value={analytics?.totalChallenges || 0} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Active initiatives</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card className="glass-card-hover">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-primary">
                                    <AnimatedCounter value={analytics?.totalSubmissions || 0} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Solutions received</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card className="glass-card-hover">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg Quality Score</CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-emerald-500">
                                    <AnimatedCounter value={parseFloat(analytics?.avgQualityScore || '0')} decimals={1} suffix="/5" />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Idea ratings</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card className="glass-card-hover">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Pilots</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-teal-500">
                                    <AnimatedCounter value={0} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">In progress</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Tabs for Analytics and Challenges */}
                <Tabs defaultValue="challenges" className="w-full">
                    <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                        <TabsTrigger value="challenges">Challenges</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="challenges" className="mt-6 space-y-6">
                        {/* Create Challenge Button */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Your Challenges</h2>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="group">
                                        <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                                        New Challenge
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Post a New Challenge</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleCreate} className="space-y-4 py-4">
                                        <Input
                                            placeholder="Challenge Title"
                                            value={newChallenge.title}
                                            onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                                            required
                                        />
                                        <Input
                                            placeholder="Sector (e.g., Health, Transport, Legal)"
                                            value={newChallenge.sector}
                                            onChange={(e) => setNewChallenge({ ...newChallenge, sector: e.target.value })}
                                            required
                                        />
                                        <Textarea
                                            placeholder="Detailed Description"
                                            className="min-h-[120px]"
                                            value={newChallenge.description}
                                            onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                                            required
                                        />
                                        <Textarea
                                            placeholder="Terms and Conditions (Optional)"
                                            className="min-h-[80px]"
                                            value={newChallenge.termsAndConditions}
                                            onChange={(e) => setNewChallenge({ ...newChallenge, termsAndConditions: e.target.value })}
                                        />
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="requiresNDA"
                                                checked={newChallenge.requiresNDA}
                                                onChange={(e) => setNewChallenge({ ...newChallenge, requiresNDA: e.target.checked })}
                                                className="w-4 h-4"
                                            />
                                            <label htmlFor="requiresNDA" className="text-sm">Requires NDA</label>
                                        </div>
                                        <Button type="submit" className="w-full">Create Challenge</Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Challenges Grid */}
                        {isLoading ? (
                            <p>Loading challenges...</p>
                        ) : (
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {challenges.map((challenge: any, index) => {
                                    const engagement = getEngagementBadge(challenge.engagementScore || 0);
                                    return (
                                        <motion.div key={challenge._id} variants={item}>
                                            <Card className="group relative overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
                                                <CardHeader>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <Badge variant="glass">{challenge.sector}</Badge>
                                                        <Badge variant={engagement.variant}>{engagement.label}</Badge>
                                                    </div>
                                                    <CardTitle className="line-clamp-1">{challenge.title}</CardTitle>
                                                    <CardDescription className="line-clamp-2">
                                                        {challenge.description}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="flex-grow">
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Submissions:</span>
                                                            <span className="font-medium">{challenge.submissionCount || 0}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Engagement:</span>
                                                            <span className="font-medium">{challenge.engagementScore || 0}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="flex justify-between items-center gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => navigate(`/challenge/${challenge._id}`)}>
                                                        View Submissions
                                                    </Button>
                                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(challenge._id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </TabsContent>

                    <TabsContent value="analytics" className="mt-6 space-y-8">
                        {/* Submission Trends */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" />
                                    Submission Trends (Last 7 Days)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {analytics?.submissionTrends?.length > 0 ? (
                                    <SubmissionTrendChart data={analytics.submissionTrends} />
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">No trend data available</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Sector Heatmap */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Sector Activity Heatmap</CardTitle>
                                <CardDescription>Engagement scores by sector</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {analytics?.sectorHeatmap?.length > 0 ? (
                                    <SectorHeatmap data={analytics.sectorHeatmap} />
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">No sector data available</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default EnhancedGovDashboard;
