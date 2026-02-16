'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Heart, Package, Star, LayoutDashboard, Plus, ShoppingBag, ShoppingBasket } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { authService } from '@/lib/auth';
import { SlideOver } from "@/components/ui/SlideOver";
import { productService, Product } from '@/lib/product';
import ProductForm, { ProductFormData } from '@/components/product/ProductForm';
import { favoritesService } from '@/lib/favorites';

interface OrderSummary {
    id: string;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    date: string;
    items: number;
}

export default function CustomerDashboard() {
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [favorites, setFavorites] = useState<Product[]>([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        pendingOrders: 0,
        favoriteItems: favorites.length,
        pageVisits: 0,
        productViews: 0
    });
    const [createdProducts, setCreatedProducts] = useState<Product[]>([]);

    const [isClient, setIsClient] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

    useEffect(() => {
        setStats((prev) => ({
            ...prev,
            favoriteItems: favorites.length,
            totalOrders: orders.length,
            pageVisits: orders.length * 150 + favorites.length * 40,
            productViews: favorites.length * 12 + orders.length * 5
        }));
    }, [favorites.length, orders.length]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const favoritesList = await favoritesService.getFavorites();
            setFavorites(favoritesList);
        };
        fetchFavorites();
    }, []);

    const loadCreatedProducts = useCallback(async () => {
        try {
            const products = await productService.getProductsByUser();
            setCreatedProducts(products);
        } catch (error) {
            console.error('Failed to load user products', error);
        }
    }, []);

    useEffect(() => {
        loadCreatedProducts();
    }, [loadCreatedProducts]);

    useEffect(() => {
        setIsClient(true);
        setIsAuthenticated(authService.isAuthenticated());
    }, []);

    const handdleAddProduct = async (product: ProductFormData) => {
        try {
            const categoryIdNum = Number(product.category_id);
            const base = {
                name: product.name,
                description: product.description,
                price: Number(product.price),
                image_url: product.image_url,
                stock: Number(product.stock),
                currency: product.currency
            };
            const payload =
                !Number.isNaN(categoryIdNum) && categoryIdNum >= 1
                    ? { ...base, category_id: categoryIdNum }
                    : { ...base, category: String(product.category_id) };
            await productService.createProduct(payload as any);
            await loadCreatedProducts();
            setIsSlideOverOpen(false);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    // Función para manejar cuando se cierra el modal
    const handleCloseModal = () => {
        setIsSlideOverOpen(false);
        // Recargar productos cuando se cierra el modal
    };

    const getStatusColor = (status: string) => {
        const colors = {
            pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
            processing: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
            shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
            delivered: 'bg-green-500/20 text-green-400 border-green-500/50'
        };
        return colors[status as keyof typeof colors];
    };

    const getStatusText = (status: string) => {
        const texts = {
            pending: 'Pending',
            processing: 'Processing',
            shipped: 'Shipped',
            delivered: 'Delivered'
        };
        return texts[status as keyof typeof texts];
    };

    const productsCreated = createdProducts.length;

    const metricCards = [
        {
            label: 'Products created',
            value: productsCreated,
            icon: ShoppingBag,
            helper: 'Total products you\'ve listed', // o 'Items added to catalog'
            accent: 'text-blue-400'
        },
        {
            label: 'Products purchased',
            value: stats.productViews,
            icon: ShoppingBasket,
            helper: 'Items bought', // o 'Successful sales'
            accent: 'text-red-400'
        },
        {
            label: 'Favorites',
            value: favorites.length,
            icon: Heart,
            helper: 'Saved for later', // ✅ Este está bien
            accent: 'text-pink-400'
        },
        {
            label: 'Orders',
            value: stats.totalOrders,
            icon: ShoppingCart,
            helper: 'Completed purchases', // o 'Total transactions'
            accent: 'text-green-400',
            extra: `$${stats.totalSpent.toLocaleString()} spent`
        }
    ];

    return (
        <div className="max-w-7xl w-full min-h-screen flex flex-col items-center">
            {isClient && isAuthenticated ? (
                <>
                    {/* Header */}
                    <div className="relative overflow-hidden w-full mt-10 mb-10">
                        <div className="relative max-w-7xl mx-auto w-full p-8">
                            <div className="text-left flex items-center justify-between">
                                <div className="flex flex-col items-start justify-center gap-2">
                                    <h1 className="text-5xl font-bold text-white flex items-center gap-3 justify-center">
                                        <LayoutDashboard size={36} />
                                        Dashboard insights for your store
                                    </h1>
                                    <p className="text-gray-400 text-lg">
                                        Track your page, product, favorites, and order performance in one place
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {metricCards.map((card) => {
                                const Icon = card.icon;
                                return (
                                    <div
                                        key={card.label}
                                        className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="bg-white/10 p-3 rounded-xl">
                                                <Icon className={card.accent} size={24} />
                                            </div>
                                            <span className="text-xs text-gray-400">{card.helper}</span>
                                        </div>
                                        <h3 className="text-gray-400 text-sm mb-1">{card.label}</h3>
                                        <p className="text-3xl font-bold text-white">{card.value.toLocaleString()}</p>
                                        {card.extra && <p className="text-xs text-gray-400 mt-2">{card.extra}</p>}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 min-h-[360px]">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <Plus size={24} className="text-blue-400" />
                                        Add products
                                    </h2>
                                    <Link href="/orders">
                                        <Button variant="primary" size="sm" className="text-blue-400 hover:text-blue-300">
                                            View All
                                        </Button>
                                    </Link>
                                </div>

                                {createdProducts.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package size={48} className="text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400">No products created yet</p>
                                        <p className="text-gray-400 text-sm">
                                            Usa el botón de abajo para agregar el primero.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 flex flex-col">
                                        {createdProducts.slice(0, 3).map((product) => (
                                            <Link href={`/products/${product.id}`} key={product.id}>
                                                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-3 hover:border-blue-500/50 transition-all duration-300 cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative h-[40px] w-[60px] flex-shrink-0">
                                                            <Image
                                                                src={product.image_url}
                                                                alt={product.name}
                                                                fill
                                                                sizes="60px"
                                                                className="rounded-lg object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-white font-semibold text-sm line-clamp-1">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-blue-400 font-bold">
                                                                {product.currency} {product.price}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                                {createdProducts.length > 3 && (
                                    <div className="mt-4 text-xs text-gray-500 text-center">
                                        Showing 3 of {createdProducts.length} created products. Visit the orders page to see them all.
                                    </div>
                                )}
                                <div className="mt-6 flex justify-center">
                                    <Button variant="primary" onClick={() => setIsSlideOverOpen(true)}>
                                        Add New Product
                                    </Button>
                                </div>
                                </div>
                            </div>
                            
                            {/* Recent Orders */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                            <Package size={24} className="text-blue-400" />
                                            Your orders
                                        </h2>
                                        <Link href="/orders">
                                            <Button variant="primary" size="sm" className="text-blue-400 hover:text-blue-300">
                                                View All
                                            </Button>
                                        </Link>
                                    </div>

                                    {orders.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Package size={48} className="text-gray-600 mx-auto mb-4" />
                                            <p className="text-gray-400">No orders yet</p>
                                            <Link href="/products">
                                                <Button variant="primary" size="sm" className="mt-4">
                                                    Start Shopping
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    
                                                    className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 hover:border-blue-500/50 transition-all duration-300"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div>
                                                            <p className="text-white font-semibold">Order #{order.id}</p>
                                                            <p className="text-gray-400 text-sm">{order.date}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                                            {getStatusText(order.status)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-gray-400 text-sm">{order.items} items</p>
                                                        <p className="text-white font-bold">${order.total.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Favorites */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 min-h-[320px]">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                            <Heart size={24} className="text-pink-400" />
                                            Favorites
                                        </h2>
                                        {favorites.length > 0 && (
                                            <Button variant="pink" size="sm">
                                                View Favorites
                                            </Button>
                                        )}
                                    </div>

                                    {favorites.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Heart size={48} className="text-gray-600 mx-auto mb-4" />
                                            <p className="text-gray-400 text-sm">No favorites yet</p>
                                            <Link href="/favorites">
                                                <Button variant="pink" size="sm" className="mt-4">
                                                    View Favorites
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 flex flex-col">
                                            {favorites.slice(0, 3).map((product) => (
                                                <Link href={`/products/${product.id}`} key={product.id}>
                                                    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-3 hover:border-pink-500/50 transition-all duration-300 cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative h-[40px] w-[60px] flex-shrink-0">
                                                                <Image
                                                                    src={product.image_url}
                                                                    alt={product.name}
                                                                    fill
                                                                    sizes="60px"
                                                                    className="rounded-lg object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-white font-semibold text-sm line-clamp-1">
                                                                    {product.name}
                                                                </p>
                                                                <p className="text-blue-400 font-bold">
                                                                    {product.currency} {product.price}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                    {favorites.length > 3 && (
                                        <div className="mt-4 text-xs text-gray-500 text-center">
                                            Showing 3 of {favorites.length} favorites. Go to the favorites page to see all of them.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
                    <div className="flex flex-col items-center gap-6 text-center">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold">You are not authenticated</h1>
                            <p className="text-lg text-gray-400">
                                Please login to access your dashboard
                            </p>
                            <p className="text-lg text-gray-400">
                                If you don't have an account, please register
                            </p>
                        </div>
                        
                        <div className="flex gap-4">
                            <Link href="/register">
                                <Button variant="primary" size="lg">
                                    Register
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="success" size="lg">
                                    Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
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