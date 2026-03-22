import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getComments, addComment, Comment } from '@/services/commentService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, User } from 'lucide-react';
import { toast } from 'sonner';

const IdeaDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchComments = async () => {
        if (!id) return;
        try {
            const data = await getComments(id);
            setComments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [id]);

    const handleSend = async () => {
        if (!id || !newComment.trim()) return;
        try {
            await addComment({ content: newComment, ideaId: id });
            setNewComment('');
            fetchComments();
            toast.success('Comment added');
        } catch (error) {
            toast.error('Failed to add comment');
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-2xl font-bold">Discussion & Feedback</h1>

                {/* Placeholder for Idea Details - ideally fetched */}
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle>Idea Discussion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Detailed view of the idea and collaboration thread.</p>
                    </CardContent>
                </Card>

                {/* Custom Comment Section Design */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {comments.map((comment) => (
                            <div key={comment._id} className={`flex gap-4 ${comment.author._id === user?._id ? 'flex-row-reverse' : ''}`}>
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
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t md:static md:bg-transparent md:border-0 md:p-0">
                        <div className="flex gap-2 max-w-4xl mx-auto">
                            <Textarea
                                placeholder="Type your feedback/comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="resize-none min-h-[50px]"
                            />
                            <Button size="icon" className="h-auto" onClick={handleSend}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdeaDetails;
