'use client';

import { authService } from './auth';

export interface Product {
    id?: string | number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
    category_id: number | string;
    category?: string;
    currency: string;
    user_id?: number | null;
}

/** Payload para crear producto (sin id; category_id numérico). */
export interface CreateProductPayload {
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
    category_id: number;
    currency: string;
}

const getAuthHeaders = () => {
    const token = authService.getToken();
    if (!token) {
        throw new Error('User must be authenticated to perform this action');
    }
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

export const productService = {
    async getProducts (): Promise<Product[]> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    },

    async getProductsByUser(): Promise<Product[]> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/me`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Failed to load your products');
        }
        return response.json();
    },

    async createProduct(product: CreateProductPayload | Product) {
        const payload = 'category_id' in product && typeof product.category_id === 'number'
            ? product
            : { ...product, category_id: Number((product as Product).category_id) };
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create product');
        return data;
    },

    async updateProduct(product: Product) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}`, {
            method: 'PUT',
            body: JSON.stringify(product),
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        return data;
    },
    
    async deleteProduct(id: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        return data;
    },

    async getProductById(id: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Product not found');
        }
        const data = await response.json();
        return data;
    }
}