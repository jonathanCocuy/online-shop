import { db } from "../config/db";
import { withNormalizedImages } from "../utils/image";

export class CartService {
    async getCart(userId: number) {
        const [rows] = await db.query(
            `SELECT c.id, c.user_id, c.product_id, c.quantity, p.name, p.price, p.image_url, p.currency, p.stock
             FROM cart_items c
             INNER JOIN products p ON p.id = c.product_id
             WHERE c.user_id = ?
             ORDER BY c.created_at DESC`,
            [userId]
        );
        const list = (Array.isArray(rows) ? rows : []) as { image_url?: string | null }[];
        return withNormalizedImages(list);
    }

    async addToCart(userId: number, productId: number, quantity: number = 1) {
        const [existing] = await db.query(
            "SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?",
            [userId, productId]
        );
        const rows = existing as any[];
        if (rows && rows.length > 0) {
            const newQty = (rows[0].quantity || 0) + quantity;
            await db.query(
                "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
                [newQty, userId, productId]
            );
            return { user_id: userId, product_id: productId, quantity: newQty, updated: true };
        }
        const [result] = await db.query(
            "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
            [userId, productId, quantity]
        );
        const insertId = (result as any).insertId;
        return { id: insertId, user_id: userId, product_id: productId, quantity, updated: false };
    }

    async updateQuantity(userId: number, productId: number, quantity: number) {
        if (quantity < 1) {
            await db.query(
                "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?",
                [userId, productId]
            );
            return { removed: true };
        }
        const [result] = await db.query(
            "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
            [quantity, userId, productId]
        );
        const affected = (result as any).affectedRows;
        return { updated: affected > 0, quantity };
    }

    async removeFromCart(userId: number, productId: number) {
        const [result] = await db.query(
            "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?",
            [userId, productId]
        );
        const affected = (result as any).affectedRows;
        return { removed: affected > 0 };
    }
}
