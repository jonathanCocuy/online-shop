import { Product } from "../types/product.types";
import { db } from "../config/db";

export class ProductService {
    async createProduct(validatedData: Product) {
        console.log('🔵 Service - creando producto:', validatedData);
        
        try {
            const [result] = await db.query(
                'INSERT INTO products (name, price, description, image_url, category, stock, currency) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                [
                    validatedData.name, 
                    validatedData.price, 
                    validatedData.description, 
                    validatedData.image_url, 
                    validatedData.category, 
                    validatedData.stock, 
                    validatedData.currency
                ]
            );
            
            console.log('✅ Resultado del INSERT:', result);
            
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

    async getProducts() {
        const products = await db.query('SELECT * FROM products');
        return products[0] || null;
    }

    async getProductById(id: number) {
        const product = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return product[0] || null;
    }

    async updateProduct(id: number, validatedData: Product) {
        const product = await db.query('UPDATE products SET name = ?, price = ?, description = ?, image_url = ?, category = ?, stock = ?, currency = ? WHERE id = ?', [validatedData.name, validatedData.price, validatedData.description, validatedData.image_url, validatedData.category, validatedData.stock, validatedData.currency, id]);
        return product;
    }

    async deleteProduct(id: number) {
        const product = await db.query('DELETE FROM products WHERE id = ?', [id]);
        return product;
    }
}