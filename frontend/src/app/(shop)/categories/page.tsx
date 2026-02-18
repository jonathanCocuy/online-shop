'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import CategoryCard, { type CategoryCardData } from '@/components/categories/CategoryCard';
import CategoryFilter from '@/components/ui/Filter';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/lib/product';
import { categoryService, type Category } from '@/lib/category';

export default function CategoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [productError, setProductError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState('featured');

    const [categories, setCategories] = useState<CategoryCardData[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    const gradientLookup: Record<string, string> = {
        technology: 'from-blue-500 to-cyan-500',
        home: 'from-green-500 to-emerald-500',
        shoes: 'from-orange-500 to-red-500',
        accessories: 'from-purple-500 to-pink-500',
        sports: 'from-red-500 to-rose-500',
        clothes: 'from-indigo-500 to-purple-500'
    };

    const slugify = (value: string) => value.toLowerCase().replace(/\s+/g, '-');

    const mapCategoryToCard = (category: Category): CategoryCardData => {
        const image = category.image ?? category.image_url ?? 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=600';
        const slug = category.slug ?? slugify(category.name);
        return {
            id: category.id,
            name: category.name,
            slug,
            gradient: category.gradient ?? gradientLookup[slug] ?? 'from-slate-500 to-slate-700',
            productCount: category.product_count ?? 0
        };
    };

    const currentCategoryName = useMemo(() => {
        if (!selectedCategoryId) return 'Discover categories';
        return (
            categories.find((category) => category.id === selectedCategoryId)?.name ||
            'Discover categories'
        );
    }, [selectedCategoryId, categories]);

    const loadCategoryProducts = useCallback(
        async (categoryId?: string) => {
            if (!categoryId) {
                setProducts([]);
                setProductError(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setProductError(null);
                const data = await categoryService.getProductsByCategoryId(categoryId);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setProductError('Unable to load products for this category.');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        if (!selectedCategoryId || categoriesLoading) {
            if (!selectedCategoryId) {
                setProducts([]);
            }
            return;
        }

        const matchedCategory = categories.find((category) => category.id === selectedCategoryId);
        if (!matchedCategory) {
            setProductError('Category not found.');
            setProducts([]);
            setLoading(false);
            return;
        }

        loadCategoryProducts(matchedCategory.id);
    }, [selectedCategoryId, categories, categoriesLoading, loadCategoryProducts]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const rows = await categoryService.getCategories();
                const mapped = rows.map(mapCategoryToCard);
                setCategories(mapped);
                if (mapped.length > 0 && !selectedCategoryId) {
                    setSelectedCategoryId(mapped[0].id);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

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
                                {currentCategoryName.toUpperCase()}
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
                {categoriesLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <p className="text-gray-500">Loading categories…</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No categories available.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onClick={() => setSelectedCategoryId(category.id)}
                                isActive={selectedCategoryId === category.id}
                            />
                        ))}
                    </div>
                )}
            </section>

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Products Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-6 py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                        <p className="text-gray-400 text-lg">Loading products...</p>
                    </div>
                ) : productError ? (
                    <div className="text-center py-20">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-12 border border-gray-700 inline-block mb-6">
                            <Filter size={64} className="text-gray-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Oops!</h2>
                        <p className="text-gray-400 mb-8">{productError}</p>
                        <Link href="/categories">
                            <Button variant="primary">Browse Categories</Button>
                        </Link>
                    </div>
                ) : !selectedCategoryId ? (
                    <div className="text-center py-20">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-12 border border-gray-700 inline-block mb-6">
                            <Filter size={64} className="text-gray-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Select a category</h2>
                        <p className="text-gray-400 mb-8">Click on a category above to explore its products.</p>
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