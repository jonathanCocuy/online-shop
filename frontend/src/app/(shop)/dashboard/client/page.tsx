'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Package, TrendingUp, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

interface OrderSummary {
    id: string;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    date: string;
    items: number;
}

interface FavoriteProduct {
    id: string;
    name: string;
    price: number;
    image: string;
    currency: string;
}

export default function CustomerDashboard() {
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        pendingOrders: 0,
        favoriteItems: 0
    });

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

    return (
        <div className="min-h-screen w-full max-w-7xl mt-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-gray-800 rounded-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Welcome back, Customer! 👋
                            </h1>
                            <p className="text-gray-400">
                                Here is what is happening with your orders today
                            </p>
                        </div>
                        <Link href="/products">
                            <Button variant="primary" className="bg-gradient-to-r from-blue-600 to-purple-600">
                                Browse Products
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-7xl mx-auto py-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Orders */}
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-500/20 p-3 rounded-xl">
                                <ShoppingCart className="text-blue-400" size={24} />
                            </div>
                        </div>
                        <h3 className="text-gray-400 text-sm mb-1">Total Orders</h3>
                        <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
                    </div>

                    {/* Total Spent */}
                    <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-500/20 p-3 rounded-xl">
                                <TrendingUp className="text-green-400" size={24} />
                            </div>
                        </div>
                        <h3 className="text-gray-400 text-sm mb-1">Total Spent</h3>
                        <p className="text-3xl font-bold text-white">${stats.totalSpent.toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2">
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
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Heart size={24} className="text-pink-400" />
                                    Favorites
                                </h2>
                            </div>

                            {favorites.length === 0 ? (
                                <div className="text-center py-12">
                                    <Heart size={48} className="text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 text-sm">No favorites yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {favorites.map((product) => (
                                        <Link href={`/products/${product.id}`} key={product.id}>
                                            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-3 hover:border-pink-500/50 transition-all duration-300 cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        width={60}
                                                        height={60}
                                                        className="rounded-lg object-cover"
                                                    />
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}