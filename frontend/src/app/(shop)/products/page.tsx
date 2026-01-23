"use client";

import { useEffect, useState } from "react";
import { productService } from "@/lib/product";
import { Product } from "@/lib/product";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { SlideOver } from "@/components/ui/SlideOver";
import ProductForm from "@/components/product/ProductForm";

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

    useEffect(() => {
        productService.getProducts().then((products) => {
            setProducts(products);
            setLoading(false);
        }).catch((error) => {
            setError(error.message);
            setLoading(false);
        });
    }, []);

    const handleFormSubmit = () => {
        // Aquí manejas el submit del formulario
        setIsSlideOverOpen(false);
        // Opcional: recargar productos
        // productService.getProducts().then(setProducts);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-center mb-20 mt-10">Products</h1>
            <div className="mb-10 w-2/3 flex justify-start">
                <Button 
                    variant="primary" 
                    onClick={() => setIsSlideOverOpen(true)}
                >
                    Add Product
                </Button>
            </div>
            
            <div className="flex flex-col items-center justify-center">
                {loading && (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                        <p className="text-white">Loading products...</p>
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <p className="text-white">No products found</p>
                    </div>
                )}
                {error && (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <p className="text-white">Contact the administrator</p>
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center items-center">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Slide Over Panel */}
            <SlideOver
                isOpen={isSlideOverOpen}
                onClose={() => setIsSlideOverOpen(false)}
                title="Add Product"
            >
                <ProductForm 
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsSlideOverOpen(false)}
                />
            </SlideOver>
        </div>
    );
}