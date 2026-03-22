import api from './api';

export interface Comment {
    _id: string;
    content: string;
    author: {
        _id: string;
        username: string;
        role: string;
    };
    ideaId: string;
    createdAt: string;
}

export const getComments = async (ideaId: string) => {
    const response = await api.get<Comment[]>(`/comments/${ideaId}`);
    return response.data;
};

export const addComment = async (data: { content: string; ideaId: string }) => {
    const response = await api.post('/comments', data);
    return response.data;
};
