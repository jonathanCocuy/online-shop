import { Product } from "../types/product.types";
import { db } from "../config/db";
import { withNormalizedImage, withNormalizedImages } from "../utils/image";

type ProductInput = Product & { category?: string };

async function resolveCategoryId(data: ProductInput): Promise<number> {
    if (data.category_id != null && Number.isInteger(data.category_id)) return data.category_id;
    if (data.category != null && String(data.category).trim()) {
        const name = String(data.category).trim().toLowerCase();
        const [rows] = await db.query('SELECT id FROM categories WHERE LOWER(TRIM(name)) = ?', [name]);
        const list = (Array.isArray(rows) ? rows : []) as { id: number }[];
        if (list.length) return list[0].id;
        const [insert] = await db.query('INSERT INTO categories (name) VALUES (?)', [data.category.trim()]);
        return (insert as any).insertId;
    }
    throw new Error('Either category or category_id is required');
}

export class ProductService {
    async createProduct(validatedData: ProductInput, userId: number) {
        try {
            const categoryId = await resolveCategoryId(validatedData);
            const [result] = await db.query(
                'INSERT INTO products (name, price, description, image_url, category_id, stock, currency, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    validatedData.name,
                    validatedData.price,
                    validatedData.description,
                    validatedData.image_url,
                    categoryId,
                    validatedData.stock,
                    validatedData.currency,
                    userId
                ]
            );
            const insertId = (result as any).insertId;
            return withNormalizedImage({ id: insertId, ...validatedData, category_id: categoryId, user_id: userId } as any);
        } catch (error) {
            console.error('❌ Error en DB query:', error);
            throw error;
        }
    }

    async getProducts() {
        const [rows] = await db.query(
            `SELECT p.*, c.name AS category FROM products p
             LEFT JOIN categories c ON c.id = p.category_id`
        );
        const list = (Array.isArray(rows) ? rows : []) as { image_url?: string | null }[];
        return withNormalizedImages(list);
    }

    async getProductsByUser(userId: number) {
        const [rows] = await db.query(
            `SELECT p.*, c.name AS category FROM products p
             LEFT JOIN categories c ON c.id = p.category_id
             WHERE p.user_id = ?
             ORDER BY p.created_at DESC`,
            [userId]
        );
        const list = (Array.isArray(rows) ? rows : []) as { image_url?: string | null }[];
        return withNormalizedImages(list);
    }

    async getProductById(id: number) {
        const [rows] = await db.query(
            `SELECT p.*, c.name AS category FROM products p
             LEFT JOIN categories c ON c.id = p.category_id
             WHERE p.id = ?`,
            [id]
        );
        const list = rows as any[];
        const one = list && list.length > 0 ? list[0] : null;
        return one ? withNormalizedImage(one) : null;
    }

    async updateProduct(id: number, validatedData: ProductInput) {
        const categoryId = await resolveCategoryId(validatedData);
        await db.query(
            'UPDATE products SET name = ?, price = ?, description = ?, image_url = ?, category_id = ?, stock = ?, currency = ? WHERE id = ?',
            [validatedData.name, validatedData.price, validatedData.description, validatedData.image_url, categoryId, validatedData.stock, validatedData.currency, id]
        );
        return this.getProductById(id);
    }

    async deleteProduct(id: number) {
        const product = await db.query('DELETE FROM products WHERE id = ?', [id]);
        return product;
    }
}