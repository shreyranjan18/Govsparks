import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Send, Mail, MailOpen, Shield, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/services/api';

interface Message {
    _id: string;
    sender: {
        _id: string;
        username: string;
        role: string;
        organization: string;
    };
    receiver: {
        _id: string;
        username: string;
        role: string;
        organization: string;
    };
    subject: string;
    content: string;
    isRead: boolean;
    readAt?: Date;
    createdAt: Date;
}

interface MessagingInterfaceProps {
    ideaId: string;
    receiverId?: string;
}

export const MessagingInterface: React.FC<MessagingInterfaceProps> = ({ ideaId, receiverId }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newMessage, setNewMessage] = useState({
        subject: '',
        content: ''
    });

    const fetchMessages = async () => {
        try {
            const response = await api.get(`/messages/${ideaId}`);
            setMessages(response.data);

            // Mark unread messages as read
            response.data.forEach(async (msg: Message) => {
                if (!msg.isRead && msg.receiver._id === user?._id) {
                    await api.put(`/messages/${msg._id}/read`);
                }
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        // Poll for new messages every 30 seconds
        const interval = setInterval(fetchMessages, 30000);
        return () => clearInterval(interval);
    }, [ideaId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!receiverId) {
            toast.error('Receiver not specified');
            return;
        }

        try {
            await api.post('/messages', {
                ideaId,
                receiverId,
                subject: newMessage.subject,
                content: newMessage.content
            });

            toast.success('Message sent successfully');
            setNewMessage({ subject: '', content: '' });
            setIsDialogOpen(false);
            fetchMessages();
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Official Communications
                </h3>
                {receiverId && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Send className="w-4 h-4 mr-2" />
                                New Message
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Send Official Message</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSend} className="space-y-4 py-4">
                                <Input
                                    placeholder="Subject"
                                    value={newMessage.subject}
                                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                                    required
                                />
                                <Textarea
                                    placeholder="Message content..."
                                    className="min-h-[150px]"
                                    value={newMessage.content}
                                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                                    required
                                />
                                <Button type="submit" className="w-full">Send Message</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {isLoading ? (
                <p className="text-muted-foreground text-center py-8">Loading messages...</p>
            ) : messages.length === 0 ? (
                <Card className="p-8">
                    <div className="text-center">
                        <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No messages yet</p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence>
                        {messages.map((message, index) => {
                            const isSender = message.sender._id === user?._id;
                            const isGovernment = message.sender.role === 'government';

                            return (
                                <motion.div
                                    key={message._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className={`${isSender ? 'bg-primary/5 border-primary/20' : ''}`}>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isGovernment ? 'bg-blue-500/10' : 'bg-emerald-500/10'
                                                        }`}>
                                                        {isGovernment ? (
                                                            <Shield className="w-5 h-5 text-blue-500" />
                                                        ) : (
                                                            <Briefcase className="w-5 h-5 text-emerald-500" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{message.sender.username}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {message.sender.organization}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {!isSender && (
                                                        message.isRead ? (
                                                            <MailOpen className="w-4 h-4 text-muted-foreground" />
                                                        ) : (
                                                            <Badge variant="default" className="text-xs">New</Badge>
                                                        )
                                                    )}
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDate(message.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {message.sender.role === 'government' ? 'Official' : 'Entrepreneur'}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">→</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {message.receiver.username}
                                                </span>
                                            </div>
                                            <h4 className="font-semibold text-sm mt-2">{message.subject}</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                                {message.content}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};
