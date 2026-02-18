'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CartItem } from '@/lib/cart';

interface CartCardProps {
    item: CartItem;
    currencySymbol: string;
    formatPrice: (price: number, currency: string) => string;
    onIncrement: () => void;
    onDecrement: () => void;
    onRemove: () => void;
}

export default function CartCard({
    item,
    currencySymbol,
    formatPrice,
    onIncrement,
    onDecrement,
    onRemove
}: CartCardProps) {
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-32 h-32 bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <Link href={`/products/${item.id}`}>
                                <h3 className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
                                    {item.name}
                                </h3>
                            </Link>
                            <p className="text-blue-400 text-sm font-semibold mt-1">
                                {item.category?.toUpperCase()}
                            </p>
                        </div>
                        <button
                            onClick={onRemove}
                            className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
                        <div className="text-2xl font-bold text-white">
                            {currencySymbol}{' '}
                            {formatPrice(item.price, item.currency)}
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm">Quantity:</span>
                            <div className="flex items-center bg-gray-900 rounded-lg border border-gray-700">
                                <button
                                    onClick={onDecrement}
                                    className="p-2 hover:bg-gray-700 transition-colors rounded-l-lg"
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus size={16} className="text-gray-400" />
                                </button>
                                <span className="px-4 py-2 text-white font-semibold min-w-[3rem] text-center">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={onIncrement}
                                    className="p-2 hover:bg-gray-700 transition-colors rounded-r-lg"
                                    disabled={item.quantity >= item.stock}
                                >
                                    <Plus size={16} className="text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {item.stock < 10 && (
                        <div className="mt-3 text-orange-400 text-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                            Only {item.stock} left in stock
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                        <span className="text-gray-400">Subtotal:</span>
                        <span className="text-xl font-bold text-green-400">
                            {currencySymbol}{' '}
                            {formatPrice(item.price * item.quantity, item.currency)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
