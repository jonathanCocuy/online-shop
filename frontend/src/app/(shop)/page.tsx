'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
    ArrowRight, 
    ShoppingBag, 
    TrendingUp, 
    Star,
    Zap,
    Shield,
    Truck,
    HeadphonesIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import CategoryCard, { type CategoryCardData } from '@/components/categories/CategoryCard';
import ProductCard from '@/components/product/ProductCard';
import { Product, productService } from '@/lib/product';

export default function Shop() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const products = await productService.getProducts();
                setFeaturedProducts(products.slice(0, 8));
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

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
            slug: 'accesories',
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

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDE4di0yaDEyek0zNiAyNnYySDE4di0yaDEyek0zNiAyMnYySDE4di0yaDEyek0zNiAxOHYySDE4di0yaDE4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 "></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px] py-20">
                        {/* Left Content */}
                        <div className="text-center lg:text-left z-10">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                                <Zap size={16} className="text-blue-400" />
                                <span className="text-blue-400 text-sm font-semibold">New Arrivals Every Week</span>
                            </div>

                            {/* Main Headline */}
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                                Everything You Need
                                <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                                    In One Place
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0">
                                Discover thousands of quality products at unbeatable prices. Fast shipping, secure payments, and exceptional service.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link href="/products">
                                    <Button 
                                        variant="primary" 
                                        size="lg" 
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 text-lg px-8 flex items-center gap-2 justify-center"
                                    >
                                        Shop Now
                                        <ArrowRight className="ml-2" size={20} />
                                    </Button>
                                </Link>
                                <Link href="/categories">
                                    <Button 
                                        variant="secondary" 
                                        size="lg"
                                        className="text-lg px-8"
                                    >
                                        Browse Categories
                                    </Button>
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 mt-12 max-w-lg mx-auto lg:mx-0">
                                <div className="text-center lg:text-left">
                                    <div className="text-3xl font-bold text-white mb-1">{featuredProducts.length}</div>
                                    <div className="text-gray-400 text-sm">Products</div>
                                </div>
                                <div className="text-center lg:text-left">
                                    <div className="text-3xl font-bold text-white mb-1">50K+</div>
                                    <div className="text-gray-400 text-sm">Customers</div>
                                </div>
                                <div className="text-center lg:text-left">
                                    <div className="text-3xl font-bold text-white mb-1">4.9★</div>
                                    <div className="text-gray-400 text-sm">Rating</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Hero Image */}
                        <div className="relative hidden lg:block">
                            <div className="relative w-full h-[500px]">
                                {/* Floating Cards */}
                                <div className="absolute top-10 right-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-6 shadow-2xl shadow-blue-500/50 animate-float z-20 max-w-xs">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-white/20 p-2 rounded-lg">
                                            <ShoppingBag className="text-white" size={24} />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-lg">2,847</div>
                                            <div className="text-blue-100 text-xs">Products Sold Today</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-20 left-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 shadow-2xl shadow-green-500/50 animate-float-delayed z-20 max-w-xs">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/20 p-2 rounded-lg">
                                            <Star className="text-white fill-white" size={24} />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-lg">4.9/5.0</div>
                                            <div className="text-green-100 text-xs">Customer Rating</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Hero Image */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-96 h-96 animate-bounce-slow">
                                        <Image
                                            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"
                                            alt="Shopping bags"
                                            fill
                                            className="object-contain drop-shadow-2xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 border-y border-gray-800 bg-gray-900/50 rounded-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-500/10 p-3 rounded-xl">
                                <Truck className="text-blue-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">Free Shipping</h3>
                                <p className="text-gray-400 text-sm">On orders over $100</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-green-500/10 p-3 rounded-xl">
                                <Shield className="text-green-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">Secure Payment</h3>
                                <p className="text-gray-400 text-sm">100% secure transactions</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-purple-500/10 p-3 rounded-xl">
                                <HeadphonesIcon className="text-purple-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">24/7 Support</h3>
                                <p className="text-gray-400 text-sm">Dedicated customer service</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-orange-500/10 p-3 rounded-xl">
                                <TrendingUp className="text-orange-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1">Best Prices</h3>
                                <p className="text-gray-400 text-sm">Competitive pricing guaranteed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Shop by Category
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Browse through our wide range of categories to find exactly what you need
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>

                    <div className="text-center mt-10 flex justify-center">
                        <Link href="/categories">
                            <Button variant="secondary" size="lg" className='flex items-center gap-2 justify-center'>
                                View All Categories
                                <ArrowRight className="ml-2" size={18} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-20 bg-gray-900/30 flex justify-center items-center">
                <div className="max-w-7xl w-full">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Star className="text-yellow-400 fill-yellow-400" size={28} />
                                <h2 className="text-4xl md:text-5xl font-bold text-white">
                                    Featured Products
                                </h2>
                            </div>
                            <p className="text-gray-400 text-lg">
                                Hand-picked products just for you
                            </p>
                        </div>
                        <Link href="/products" className="hidden md:block">
                            <Button variant="secondary" className='flex items-center gap-2 justify-center'>
                                View All
                                <ArrowRight className="ml-2" size={18} />
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center gap-6 py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                            <p className="text-gray-400 text-lg">Loading products...</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {featuredProducts.map((product) => (
                                    <div 
                                        key={product.id} 
                                        className=""
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-10 md:hidden">
                                <Link href="/products">
                                    <Button variant="secondary" size="lg">
                                        View All Products
                                        <ArrowRight className="ml-2" size={18} />
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            
        </div>
    );
}