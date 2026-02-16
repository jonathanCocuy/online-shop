'use client';

import { Product } from './product';
import { authService } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
    const token = authService.getToken();

    if (!token) {
        throw new Error('User is not authenticated');
    }

    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const favoritesService = {
    async getFavorites(): Promise<Product[]> {
        const response = await fetch(`${API_URL}/favorites`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to load favorites');
        }

        return response.json();
    },

    async addFavorite(productId: number | string) {
        const response = await fetch(`${API_URL}/favorites/${productId}`, {
            method: 'POST',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to add product to favorites');
        }

        return response.json();
    },

    async removeFavorite(productId: number | string) {
        const response = await fetch(`${API_URL}/favorites/${productId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to remove product from favorites');
        }

        return response.json();
    }
};
