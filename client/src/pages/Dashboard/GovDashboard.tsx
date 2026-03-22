import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getChallenges, createChallenge, deleteChallenge, Challenge } from '@/services/challengeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Building2, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';

const GovDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newChallenge, setNewChallenge] = useState({
        title: '',
        description: '',
        department: user?.organization || '',
        sector: '',
    });

    const fetchChallenges = async () => {
        try {
            const data = await getChallenges();
            setChallenges(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load challenges');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createChallenge(newChallenge);
            toast.success('Challenge created successfully');
            setNewChallenge({ title: '', description: '', department: user?.organization || '', sector: '' });
            setIsDialogOpen(false);
            fetchChallenges();
        } catch (error) {
            toast.error('Failed to create challenge');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this challenge?')) {
            try {
                await deleteChallenge(id);
                toast.success('Challenge deleted');
                fetchChallenges();
            } catch (error) {
                toast.error('Failed to delete challenge');
            }
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Government Dashboard</h1>
                        <p className="text-muted-foreground">Manage your department's challenges and review solutions.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="font-medium">{user?.username}</p>
                            <p className="text-sm text-muted-foreground">{user?.organization}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Challenges</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{challenges.length}</div>
                            <p className="text-xs text-muted-foreground">+2 from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Solutions Received</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">Awaiting submissions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Collaborations</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">Projects in progress</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Challenges Section */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Your Challenges</h2>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> New Challenge
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Post a New Challenge</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Challenge Title"
                                        value={newChallenge.title}
                                        onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Sector (e.g., Health, Transport)"
                                        value={newChallenge.sector}
                                        onChange={(e) => setNewChallenge({ ...newChallenge, sector: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Textarea
                                        placeholder="Detailed Description"
                                        className="min-h-[100px]"
                                        value={newChallenge.description}
                                        onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full">Create Challenge</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <p>Loading challenges...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {challenges.map((challenge) => (
                            <Card key={challenge._id} className="group relative overflow-hidden transition-all hover:shadow-lg">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
                                                {challenge.sector}
                                            </span>
                                            <CardTitle className="line-clamp-1">{challenge.title}</CardTitle>
                                        </div>
                                    </div>
                                    <CardDescription className="line-clamp-2 mt-2">
                                        {challenge.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="flex justify-between items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                        Posted on {new Date(challenge.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => navigate(`/challenge/${challenge._id}`)}>
                                            View Submissions
                                        </Button>
                                        <Button variant="destructive" size="icon" onClick={() => handleDelete(challenge._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GovDashboard;
