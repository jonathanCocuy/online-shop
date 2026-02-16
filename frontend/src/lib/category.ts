'use client';

import { Product } from './product';

export interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
    image_url?: string;
    gradient?: string;
    product_count?: number;
}

const BASE_HEADERS = {
    'Content-Type': 'application/json'
};

export const categoryService = {
    async getCategories(): Promise<Category[]> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
            headers: BASE_HEADERS
        });

        if (!response.ok) {
            throw new Error('Failed to load categories');
        }

        return response.json();
    },

    async getCategoryBySlug(slug: string): Promise<Category | undefined> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`, {
            headers: BASE_HEADERS
        });

        if (!response.ok) {
            throw new Error('Failed to load category');
        }

        const payload = await response.json();
        return payload?.[0];
    },

    async getProductsByCategoryId(categoryId: string | number): Promise<Product[]> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}/products`, {
            headers: BASE_HEADERS
        });

        if (!response.ok) {
            throw new Error('Failed to load products for the category');
        }

        return response.json();
    }
};
