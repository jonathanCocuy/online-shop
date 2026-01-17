'use client';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
}

export const productService = {
    getProducts: async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const data = await response.json();
        return data;
    },

    async createProduct(product: Product) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
            method: 'POST',
            body: JSON.stringify(product),
        });
        const data = await response.json();
        return data;
    },

    async updateProduct(product: Product) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}`, {
            method: 'PUT',
            body: JSON.stringify(product),
        });
        const data = await response.json();
        return data;
    },

    async deleteProduct(id: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data;
    },

    async getProductById(id: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        const data = await response.json();
        return data;
    }
}