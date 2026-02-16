'use client';

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

export interface CartBackendItem {
    id: number | string;
    product_id: number;
    quantity: number;
    name: string;
    price: number;
    currency: string;
    image_url: string;
    stock: number;
    category: string;
}

export interface CartItem {
    id: string;
    cartItemId: number | string;
    productId: number;
    quantity: number;
    name: string;
    price: number;
    currency: string;
    image_url: string;
    stock: number;
    category: string;
}

const normalize = (item: CartBackendItem): CartItem => ({
    id: String(item.product_id ?? item.id),
    cartItemId: item.id,
    productId: item.product_id,
    quantity: item.quantity,
    name: item.name,
    price: item.price,
    currency: item.currency,
    image_url: item.image_url,
    stock: item.stock,
    category: item.category
});

export const cartService = {
    async getCart(): Promise<CartItem[]> {
        const response = await fetch(`${API_URL}/cart`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to load cart');
        }

        const data = await response.json();
        return data.map((item: CartBackendItem) => normalize(item));
    },

    async addToCart(productId: number | string, quantity = 1): Promise<CartItem> {
        const response = await fetch(`${API_URL}/cart/${productId}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ quantity })
        });

        if (!response.ok) {
            throw new Error('Failed to add product to cart');
        }

        const data = await response.json();
        return normalize(data);
    },

    async updateQuantity(productId: number | string, quantity: number): Promise<CartItem> {
        const response = await fetch(`${API_URL}/cart/${productId}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ quantity })
        });

        if (!response.ok) {
            throw new Error('Failed to update cart quantity');
        }

        const data = await response.json();
        return normalize(data);
    },

    async removeFromCart(productId: number | string) {
        const response = await fetch(`${API_URL}/cart/${productId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to remove product from cart');
        }

        return response.json();
    }
};
