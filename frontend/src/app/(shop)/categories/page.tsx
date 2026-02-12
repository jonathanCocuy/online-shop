'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import CategoryCard, { type CategoryCardData } from '@/components/categories/CategoryCard';
import CategoryFilter from '@/components/ui/Filter';
import ProductCard from '@/components/product/ProductCard';
import { Product, productService } from '@/lib/product';

const categories: CategoryCardData[] = [
    {
        id: '1',
        name: 'Technology',
        slug: 'technology',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600',
        gradient: 'from-blue-500 to-cyan-500',
        productCount: 245
    },
    {
        id: '2',
        name: 'Home',
        slug: 'home',
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600',
        gradient: 'from-green-500 to-emerald-500',
        productCount: 189
    },
    {
        id: '3',
        name: 'Shoes',
        slug: 'shoes',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
        gradient: 'from-orange-500 to-red-500',
        productCount: 312
    },
    {
        id: '4',
        name: 'Accessories',
        slug: 'accessories',
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600',
        gradient: 'from-purple-500 to-pink-500',
        productCount: 156
    },
    {
        id: '5',
        name: 'Sports',
        slug: 'sports',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
        gradient: 'from-red-500 to-rose-500',
        productCount: 198
    },
    {
        id: '6',
        name: 'Clothes',
        slug: 'clothes',
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600',
        gradient: 'from-indigo-500 to-purple-500',
        productCount: 421
    }
];

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
        <div className="max-w-7xl w-full min-h-screen">
            {/* Header */}
            <div className="relative overflow-hidden w-full mt-10 mb-10 flex flex-col gap-4">
                <div className="relative max-w-7xl mx-auto w-full p-8 flex flex-row justify-between items-center">
                    <div className="text-left flex items-center justify-between">
                        <div className="flex flex-col items-start justify-center gap-2">
                            <h1 className="text-5xl font-bold text-white flex items-center gap-3">
                                <Filter size={36} />
                                Category
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Discover our exclusive products
                            </p>
                        </div>
                    </div>
                    <CategoryFilter
                        sortBy={sortBy}
                        onSortChange={(value) => setSortBy(value)}
                    />  
                </div>
            </div>


            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-blue-400 font-semibold">Inspiration</p>
                        <h2 className="text-3xl font-bold text-white">Explore Popular Categories</h2>
                    </div>
                    <Link href="/categories" className="text-sm text-blue-400 font-semibold flex items-center gap-1">
                        View all
                        <ArrowLeft size={16} className="rotate-180" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            </section>

            <div className="px-4 sm:px-6 lg:px-8">
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