import api from './api';

export interface Challenge {
    _id: string;
    title: string;
    description: string;
    department: string;
    sector: string;
    status: 'open' | 'closed';
    createdAt: string;
}

export const getChallenges = async () => {
    const response = await api.get<Challenge[]>('/challenges');
    return response.data;
};

export const createChallenge = async (data: Partial<Challenge>) => {
    const response = await api.post('/challenges', data);
    return response.data;
};

export const deleteChallenge = async (id: string) => {
    const response = await api.delete(`/challenges/${id}`);
    return response.data;
};

export const getChallengeById = async (id: string) => {
    const response = await api.get<Challenge>(`/challenges/${id}`);
    return response.data;
};
