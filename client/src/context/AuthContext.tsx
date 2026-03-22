import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
    _id: string;
    username: string;
    email: string;
    role: 'government' | 'entrepreneur';
    organization?: string;
    department?: string;
    isVerified?: boolean;
    verifiedAt?: Date;
    ndaAccepted?: boolean;
    termsAccepted?: boolean;
    ipDeclarationAccepted?: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    // Verify token and get user data specific endpoint if needed, 
                    // for now assuming we store user data or fetch it. 
                    // Ideally fetch /auth/me
                    const res = await api.get('/auth/me'); // We need to implement this endpoint
                    setUser(res.data);
                } catch (error) {
                    console.error("Failed to load user", error);
                    logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
