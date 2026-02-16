export type Product = {
    id?: number;
    name: string;
    description: string;
    currency: string;
    price: number;
    stock: number;
    category_id: number;
    category?: string;
    image_url: string;
    user_id?: number | null;
}