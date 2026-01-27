'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import ProductCard from '@/components/product/ProductCard';
import { Product, productService } from '@/lib/product';

export default function CategoryPage() {
    const params = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('featured');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

    const categoryName = params.slug ? String(params.slug).charAt(0).toUpperCase() + String(params.slug).slice(1) : 'Category';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const allProducts = await productService.getProducts();
                // Filtrar por categoría
                const filtered = allProducts.filter(
                    (product) => product.category.toLowerCase() === String(params.slug).toLowerCase()
                );
                setProducts(filtered);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [params.slug]);

    const sortedProducts = [...products].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link href="/categories" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4 transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Categories
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                {categoryName}
                            </h1>
                            <p className="text-gray-400">
                                {products.length} products available
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                        <Filter className="text-gray-400" size={20} />
                        <span className="text-gray-400 font-semibold">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name: A-Z</option>
                        </select>
                    </div>
                    <Button variant="secondary" size="sm" className="flex items-center gap-2">
                        <SlidersHorizontal size={18} />
                        More Filters
                    </Button>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-6 py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                        <p className="text-gray-400 text-lg">Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-12 border border-gray-700 inline-block mb-6">
                            <Filter size={64} className="text-gray-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">No products found</h2>
                        <p className="text-gray-400 mb-8">Try adjusting your filters or browse other categories</p>
                        <Link href="/categories">
                            <Button variant="primary">Browse Categories</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedProducts.map((product) => (
                            <div key={product.id} className="transform hover:scale-105 transition-transform duration-300">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}