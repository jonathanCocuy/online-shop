import { Product } from "../types/product.types";
import { db } from "../config/db";

export class ProductService {
    async createProduct(validatedData: Product) {
        const product = await db.query('INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)', [validatedData.name, validatedData.price, validatedData.description, validatedData.image]);
        return product;
    }

    async getProducts() {
        const products = await db.query('SELECT * FROM products');
        return products[0] || null;
    }

    async getProductById(id: number) {
        const product = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return product[0] || null;
    }

    async updateProduct(id: number, validatedData: Product) {
        const product = await db.query('UPDATE products SET name = ?, price = ?, description = ?, image = ? WHERE id = ?', [validatedData.name, validatedData.price, validatedData.description, validatedData.image, id]);
        return product;
    }

    async deleteProduct(id: number) {
        const product = await db.query('DELETE FROM products WHERE id = ?', [id]);
        return product;
    }
}