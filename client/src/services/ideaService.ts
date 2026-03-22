import api from './api';
import { Challenge } from './challengeService';

export interface Idea {
    _id: string;
    title: string;
    description: string;
    techStack: string;
    cost: number;
    impact: string;
    status: 'submitted' | 'under review' | 'shortlisted' | 'pilot' | 'approved' | 'rejected';
    challengeId: Challenge;
    qualityScore?: number;
    ratingCount?: number;
    isPilotActive?: boolean;
    createdAt: string;
}

export const createIdea = async (data: any) => {
    const response = await api.post('/ideas', data);
    return response.data;
};

export const getMyIdeas = async () => {
    const response = await api.get<Idea[]>('/ideas/my-ideas');
    return response.data;
};

export const getIdeasForChallenge = async (challengeId: string) => {
    const response = await api.get<Idea[]>(`/ideas/challenge/${challengeId}`);
    return response.data;
};

export const getIdeaById = async (ideaId: string) => {
    const response = await api.get<Idea>(`/ideas/${ideaId}`);
    return response.data;
};
