import { db } from "../config/db";
import { withNormalizedImages } from "../utils/image";

export class CategoryService {
    async createCategory(validatedData: { name: string}) {
        try {
            const [result] = await db.query(
                'INSERT INTO categories (name) VALUES (?)', 
                [validatedData.name]
            );
        
            const insertId = (result as any).insertId;
            return {
                id: insertId,
                ...validatedData
            };
        } catch (error) {
            console.error('❌ Error en DB query:', error);
            throw error;
        }
    }

    async getCategories() {
        const [rows] = await db.query(
            `SELECT
                c.*,
                COUNT(p.id) AS product_count
            FROM categories c
            LEFT JOIN products p ON p.category_id = c.id
            GROUP BY c.id`
        );
        return (Array.isArray(rows) ? rows : []) as any[];
    }

    async getCategoryById(id: number) {
        const category = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
        return category[0] || null;
    }

    async updateCategory(id: number, validatedData: { name: string }) {
        const category = await db.query('UPDATE categories SET name = ? WHERE id = ?', [validatedData.name, id]);
        return category;
    }

    async deleteCategory(id: number) {
        const category = await db.query('DELETE FROM categories WHERE id = ?', [id]);
        return category;
    }

    /** Productos de una categoría */
    async getProductsByCategoryId(categoryId: number) {
        const [rows] = await db.query(
            'SELECT * FROM products WHERE category_id = ?',
            [categoryId]
        );
        const list = (Array.isArray(rows) ? rows : []) as { image_url?: string | null }[];
        return withNormalizedImages(list);
    }
}
