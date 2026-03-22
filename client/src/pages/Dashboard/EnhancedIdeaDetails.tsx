import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getComments, addComment, Comment } from '@/services/commentService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, ArrowLeft, Star, Rocket, FileText, Upload, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { StatusTimeline } from '@/components/StatusTimeline';
import { FileUpload } from '@/components/FileUpload';
import { MessagingInterface } from '@/components/MessagingInterface';
import api from '@/services/api';

const EnhancedIdeaDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [idea, setIdea] = useState<any>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [ratingFeedback, setRatingFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        if (!id) return;
        try {
            const [ideaRes, commentsData, statusHistory] = await Promise.all([
                api.get(`/ideas/${id}`),
                getComments(id),
                api.get(`/status/${id}/history`)
            ]);

            setIdea({ ...ideaRes.data, statusHistory: statusHistory.data });
            setComments(commentsData);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load idea details');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleSend = async () => {
        if (!id || !newComment.trim()) return;
        try {
            await addComment({ content: newComment, ideaId: id });
            setNewComment('');
            fetchData();
            toast.success('Comment added');
        } catch (error) {
            toast.error('Failed to add comment');
        }
    };

    const handleRating = async () => {
        if (!id || rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        try {
            await api.post('/ratings', {
                ideaId: id,
                score: rating,
                feedback: ratingFeedback
            });
            toast.success('Rating submitted successfully');
            setRating(0);
            setRatingFeedback('');
            fetchData();
        } catch (error) {
            toast.error('Failed to submit rating');
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!id || user?.role !== 'government') return;

        try {
            await api.put(`/status/${id}`, { status: newStatus });
            toast.success('Status updated successfully');
            fetchData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleRequestPilot = async () => {
        if (!id) return;
        try {
            await api.post('/pilot/request', {
                ideaId: id,
                message: 'We would like to initiate a pilot program for this solution.'
            });
            toast.success('Pilot request sent successfully');
            fetchData();
        } catch (error) {
            toast.error('Failed to send pilot request');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!idea) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground">Idea not found</p>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'submitted': 'bg-blue-500/10 text-blue-500',
            'under review': 'bg-yellow-500/10 text-yellow-500',
            'shortlisted': 'bg-purple-500/10 text-purple-500',
            'pilot': 'bg-teal-500/10 text-teal-500',
            'approved': 'bg-green-500/10 text-green-500',
            'rejected': 'bg-red-500/10 text-red-500'
        };
        return colors[status] || 'bg-gray-500/10 text-gray-500';
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">{idea.title}</h1>
                            <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(idea.status)}>{idea.status}</Badge>
                                {idea.qualityScore && (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                        {idea.qualityScore.toFixed(1)} / 5.0
                                    </Badge>
                                )}
                                {idea.isPilotActive && (
                                    <Badge variant="default" className="bg-teal-500">
                                        <Rocket className="w-3 h-3 mr-1" />
                                        Pilot Active
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {user?.role === 'government' && !idea.isPilotActive && idea.status !== 'rejected' && (
                            <Button onClick={handleRequestPilot} className="gap-2">
                                <Rocket className="w-4 h-4" />
                                Request Pilot
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Status Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Progress Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StatusTimeline
                                currentStatus={idea.status}
                                statusHistory={idea.statusHistory || []}
                                isInteractive={user?.role === 'government'}
                                onStatusChange={handleStatusChange}
                            />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Idea Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="discussion">Discussion</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                            <TabsTrigger value="messages">Messages</TabsTrigger>
                            {user?.role === 'government' && <TabsTrigger value="rating">Rate</TabsTrigger>}
                        </TabsList>

                        <TabsContent value="details" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Solution Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-2">Description</h3>
                                        <p className="text-muted-foreground leading-relaxed">{idea.description}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="font-semibold mb-2">Technology Stack</h3>
                                            <p className="text-muted-foreground">{idea.techStack}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Estimated Cost</h3>
                                            <p className="text-2xl font-bold text-primary">${idea.cost.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Expected Impact</h3>
                                        <p className="text-muted-foreground">{idea.impact}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Submitted By</h3>
                                        <p className="text-muted-foreground">
                                            {idea.submittedBy?.username} - {idea.submittedBy?.organization}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="discussion" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Discussion ({comments.length})</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                        {comments.map((comment) => (
                                            <motion.div
                                                key={comment._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={`flex gap-4 ${comment.author._id === user?._id ? 'flex-row-reverse' : ''}`}
                                            >
                                                <Avatar className="h-10 w-10 border">
                                                    <AvatarFallback className={comment.author.role === 'government' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}>
                                                        {comment.author.username[0].toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className={`flex flex-col max-w-[80%] ${comment.author._id === user?._id ? 'items-end' : 'items-start'}`}>
                                                    <div className={`p-3 rounded-lg text-sm ${comment.author._id === user?._id ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted rounded-tl-none'}`}>
                                                        <p>{comment.content}</p>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground mt-1">
                                                        {comment.author.username} • {new Date(comment.createdAt).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t">
                                        <Textarea
                                            placeholder="Type your feedback/comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            className="resize-none min-h-[60px]"
                                        />
                                        <Button size="icon" className="h-auto" onClick={handleSend}>
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="documents" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Upload className="w-5 h-5" />
                                        Documents & Attachments
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FileUpload
                                        ideaId={id!}
                                        fileType="proposal"
                                        onUploadComplete={fetchData}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="messages" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5" />
                                        Formal Communication
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <MessagingInterface
                                        ideaId={id!}
                                        receiverId={
                                            user?.role === 'government'
                                                ? idea.submittedBy?._id
                                                : undefined
                                        }
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {user?.role === 'government' && (
                            <TabsContent value="rating" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Rate This Solution</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Quality Score</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        className="transition-transform hover:scale-110"
                                                    >
                                                        <Star
                                                            className={`w-8 h-8 ${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Feedback (Optional)</label>
                                            <Textarea
                                                placeholder="Provide detailed feedback..."
                                                value={ratingFeedback}
                                                onChange={(e) => setRatingFeedback(e.target.value)}
                                                className="min-h-[100px]"
                                            />
                                        </div>

                                        <Button onClick={handleRating} className="w-full">
                                            Submit Rating
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )}
                    </Tabs>
                </motion.div>
            </div>
        </div>
    );
};

export default EnhancedIdeaDetails;
