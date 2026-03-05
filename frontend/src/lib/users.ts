 'use client';

import { authService } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UserProfile {
    id: number;
    user_name: string;
    last_name: string;
    email: string;
}

const getAuthHeaders = () => {
    const token = authService.getToken();
    if (!token) {
        throw new Error('User must be authenticated to fetch profile');
    }
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const usersService = {
    async getProfile(): Promise<UserProfile> {
        const response = await fetch(`${API_URL}/users/me`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Failed to load user profile');
        }

        return response.json();
    }
};
