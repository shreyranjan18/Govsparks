import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from 'sonner';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        organization: '',
        role: 'entrepreneur' // default
    });
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRoleChange = (role: string) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await api.post('/auth/register', formData);
            login(res.data.token, res.data);
            toast.success('Registration successful');

            if (res.data.role === 'government') {
                navigate('/dashboard/government');
            } else {
                navigate('/dashboard/entrepreneur');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Abstract Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <Card className="w-[500px] z-10 backdrop-blur-md bg-card/50 border-white/10 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
                    <CardDescription className="text-center">
                        Join the GovSpark ecosystem
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="entrepreneur" onValueChange={handleRoleChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="government">Government</TabsTrigger>
                            <TabsTrigger value="entrepreneur">Entrepreneur</TabsTrigger>
                        </TabsList>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="johndoe"
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="name@example.com"
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                {/* Dynamic Label based on role */}
                                <Label htmlFor="organization">
                                    {formData.role === 'government' ? 'Department / Agency' : 'Startup / Organization Name'}
                                </Label>
                                <Input
                                    id="organization"
                                    value={formData.organization}
                                    onChange={handleChange}
                                    required
                                    placeholder={formData.role === 'government' ? 'Ministry of Tech' : 'TechSolutions Inc.'}
                                    className="bg-background/50"
                                />
                            </div>

                            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                                {isLoading ? 'Creating Account...' : 'Register'}
                            </Button>
                        </form>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:underline">
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;
