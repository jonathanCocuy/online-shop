import { db } from "../config/db";
import { withNormalizedImages } from "../utils/image";

export class FavoritesService {
    async getFavorites(userId: number) {
        const [rows] = await db.query(
            `SELECT p.*, c.name AS category
             FROM products p
             INNER JOIN favorites f ON f.product_id = p.id
             LEFT JOIN categories c ON c.id = p.category_id
             WHERE f.user_id = ?
             ORDER BY f.created_at DESC`,
            [userId]
        );
        const list = (Array.isArray(rows) ? rows : []) as { image_url?: string | null }[];
        return withNormalizedImages(list);
    }

    async addFavorite(userId: number, productId: number) {
        const [result] = await db.query(
            "INSERT INTO favorites (user_id, product_id) VALUES (?, ?)",
            [userId, productId]
        );
        const insertId = (result as any).insertId;
        return { id: insertId, user_id: userId, product_id: productId };
    }

    async removeFavorite(userId: number, productId: number) {
        const [result] = await db.query(
            "DELETE FROM favorites WHERE user_id = ? AND product_id = ?",
            [userId, productId]
        );
        const affected = (result as any).affectedRows;
        return { removed: affected > 0 };
    }
}
