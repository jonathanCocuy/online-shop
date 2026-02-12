"use client";

import { useEffect, useState } from "react";
import { productService } from "@/lib/product";
import { Product } from "@/lib/product";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { SlideOver } from "@/components/ui/SlideOver";
import ProductForm, { ProductFormData } from "@/components/product/ProductForm";
import { ShoppingBag } from "lucide-react";

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

    // Función para cargar productos
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const fetchedProducts = await productService.getProducts();
            setProducts(fetchedProducts);
            setError(null);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Error loading products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handdleAddProduct = async (product: ProductFormData) => {
        try {
            const response = await productService.createProduct({ 
                id: crypto.randomUUID(), 
                name: product.name, 
                description: product.description, 
                price: Number(product.price), 
                image_url: product.image_url, 
                stock: Number(product.stock), 
                category: product.category, 
                currency: product.currency 
            });
            
            if (response.success) {
                // Recargar los productos después de crear uno nuevo
                await fetchProducts();
                setIsSlideOverOpen(false);
            } else {
                setError(response.message);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            setError('Error adding product');
        }
    };

    // Función para manejar cuando se cierra el modal
    const handleCloseModal = () => {
        setIsSlideOverOpen(false);
        // Recargar productos cuando se cierra el modal
        fetchProducts();
    };

    return (
        <div className="min-h-screen flex flex-col items-center">
            {/* Header Section */}
            <div className="relative overflow-hidden w-full mt-10 mb-10">
                <div className="relative max-w-7xl mx-auto w-full p-8">
                    <div className="text-left flex items-center justify-between">
                        <div className="flex flex-col items-start justify-center gap-2">
                            <h1 className="text-5xl font-bold text-white flex items-center gap-3">
                                <ShoppingBag size={36} />
                                Our Products
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Discover our exclusive collection
                            </p>
                        </div>
                        
                        <Button 
                            variant="primary" 
                            onClick={() => setIsSlideOverOpen(true)}
                        >
                            + Add New Product
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto">
                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center gap-6 py-20">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <p className="text-gray-400 text-lg animate-pulse">Loading products...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && products.length === 0 && !error && (
                    <div className="flex flex-col items-center justify-center gap-6 py-20">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-8 border border-gray-700">
                            <svg className="w-20 h-20 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-300 text-xl font-semibold mb-2">No products yet</p>
                            <p className="text-gray-500">Start by adding your first product</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="flex flex-col items-center justify-center gap-6 py-20">
                        <div className="bg-red-900/20 backdrop-blur-sm rounded-full p-8 border border-red-800">
                            <svg className="w-20 h-20 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-red-400 text-xl font-semibold mb-2">Oops! Something went wrong</p>
                            <p className="text-gray-400">Please contact the administrator</p>
                        </div>
                    </div>
                )}
                
                {/* Products Grid */}
                {!loading && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className=""
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Slide Over Panel */}
            <SlideOver
                isOpen={isSlideOverOpen}
                onClose={handleCloseModal}
                title="Add Product"
            >
                <ProductForm 
                    onSubmit={handdleAddProduct}
                    onCancel={handleCloseModal}
                />
            </SlideOver>
        </div>
    );
}