'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Swal from 'sweetalert2';

interface CartItem {
    id: string;
    name: string;
    price: number;
    currency: string;
    image_url: string;
    quantity: number;
    stock: number;
    category: string;
}

// Configuración de formatos por moneda
const CURRENCY_CONFIG = {
    COP: { 
        decimals: 0, 
        locale: 'es-CO', 
        symbol: "$",
    },
    USD: { 
        decimals: 2, 
        locale: 'en-US', 
        symbol: "$",
    },
    EUR: { 
        decimals: 2, 
        locale: 'de-DE', 
        symbol: "€",
    },
    GBP: { 
        decimals: 2, 
        locale: 'en-GB', 
        symbol: "£",
    },
};

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: '1',
            name: 'Wireless Headphones Pro',
            price: 299900,
            currency: 'COP',
            image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
            quantity: 2,
            stock: 15,
            category: 'technology'
        },
        {
            id: '2',
            name: 'Smart Watch Series 5',
            price: 450000,
            currency: 'COP',
            image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
            quantity: 1,
            stock: 8,
            category: 'technology'
        },
    ]);

    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    // Función para formatear el precio según la moneda
    const formatPrice = (price: number, currency: string): string => {
        const config = CURRENCY_CONFIG[currency as keyof typeof CURRENCY_CONFIG];
        if (!config) return price.toString();
        
        return price.toLocaleString(config.locale, {
            minimumFractionDigits: config.decimals,
            maximumFractionDigits: config.decimals,
        });
    };

    const updateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        
        const item = cartItems.find(item => item.id === id);
        if (item && newQuantity > item.stock) {
            Swal.fire({
                title: 'Stock Limit',
                text: `Only ${item.stock} units available`,
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        setCartItems(cartItems.map(item => 
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeItem = async (id: string) => {
        const result = await Swal.fire({
            title: 'Remove Item?',
            text: "Are you sure you want to remove this item from cart?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, remove it',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            setCartItems(cartItems.filter(item => item.id !== id));
            Swal.fire({
                title: 'Removed!',
                text: 'Item removed from cart',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }
    };

    const applyPromoCode = () => {
        if (promoCode.toUpperCase() === 'SAVE10') {
            setDiscount(10);
            Swal.fire({
                title: 'Promo Applied!',
                text: '10% discount applied successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } else if (promoCode.toUpperCase() === 'SAVE20') {
            setDiscount(20);
            Swal.fire({
                title: 'Promo Applied!',
                text: '20% discount applied successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                title: 'Invalid Code',
                text: 'The promo code you entered is not valid',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const calculateDiscount = () => {
        return (calculateSubtotal() * discount) / 100;
    };

    const calculateShipping = () => {
        return calculateSubtotal() > 100000 ? 0 : 15000;
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount() + calculateShipping();
    };

    const handleCheckout = async () => {
        const result = await Swal.fire({
            title: 'Proceed to Checkout?',
            text: `Total: COP ${formatPrice(calculateTotal(), 'COP')}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3B82F6',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, proceed',
            cancelButtonText: 'Continue Shopping'
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: 'Processing...',
                text: 'Redirecting to checkout',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            // Aquí rediriges a checkout
            // router.push('/checkout');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-12 border border-gray-700 inline-block mb-6">
                        <ShoppingBag size={80} className="text-gray-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
                    <p className="text-gray-400 mb-8">Start adding some products to your cart!</p>
                    <Link href="/products">
                        <Button variant="primary" size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                            Browse Products
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link href="/products" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4 transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        Continue Shopping
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                                <ShoppingBag size={36} />
                                Shopping Cart
                            </h1>
                            <p className="text-gray-400">
                                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Image */}
                                    <div className="relative w-full md:w-32 h-32 bg-gray-700 rounded-xl overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image_url}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <Link href={`/products/${item.id}`}>
                                                    <h3 className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
                                                        {item.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-blue-400 text-sm font-semibold mt-1">
                                                    {item.category.toUpperCase()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
                                            {/* Price */}
                                            <div className="text-2xl font-bold text-white">
                                                {CURRENCY_CONFIG[item.currency as keyof typeof CURRENCY_CONFIG]?.symbol || item.currency}{' '}
                                                {formatPrice(item.price, item.currency)}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-400 text-sm">Quantity:</span>
                                                <div className="flex items-center bg-gray-900 rounded-lg border border-gray-700">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-2 hover:bg-gray-700 transition-colors rounded-l-lg"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={16} className="text-gray-400" />
                                                    </button>
                                                    <span className="px-4 py-2 text-white font-semibold min-w-[3rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-2 hover:bg-gray-700 transition-colors rounded-r-lg"
                                                        disabled={item.quantity >= item.stock}
                                                    >
                                                        <Plus size={16} className="text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stock Warning */}
                                        {item.stock < 10 && (
                                            <div className="mt-3 text-orange-400 text-sm flex items-center gap-2">
                                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                                Only {item.stock} left in stock
                                            </div>
                                        )}

                                        {/* Item Subtotal */}
                                        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                                            <span className="text-gray-400">Subtotal:</span>
                                            <span className="text-xl font-bold text-green-400">
                                                {CURRENCY_CONFIG[item.currency as keyof typeof CURRENCY_CONFIG]?.symbol || item.currency}{' '}
                                                {formatPrice(item.price * item.quantity, item.currency)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sticky top-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

                            {/* Promo Code */}
                            <div className="mb-6">
                                <label className="text-gray-400 text-sm mb-2 block">Promo Code</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Enter code"
                                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Button
                                        variant="secondary"
                                        onClick={applyPromoCode}
                                        className="flex items-center gap-2"
                                    >
                                        <Tag size={16} />
                                        Apply
                                    </Button>
                                </div>
                                {discount > 0 && (
                                    <div className="mt-2 text-green-400 text-sm flex items-center gap-2">
                                        <Tag size={14} />
                                        {discount}% discount applied
                                    </div>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal:</span>
                                    <span className="text-white font-semibold">
                                        COP {formatPrice(calculateSubtotal(), 'COP')}
                                    </span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Discount ({discount}%):</span>
                                        <span className="font-semibold">
                                            -COP {formatPrice(calculateDiscount(), 'COP')}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-400">
                                    <span className="flex items-center gap-2">
                                        <Truck size={16} />
                                        Shipping:
                                    </span>
                                    <span className={`font-semibold ${calculateShipping() === 0 ? 'text-green-400' : 'text-white'}`}>
                                        {calculateShipping() === 0 ? 'FREE' : `COP ${formatPrice(calculateShipping(), 'COP')}`}
                                    </span>
                                </div>

                                {calculateShipping() > 0 && (
                                    <div className="text-xs text-gray-500">
                                        Free shipping on orders over COP 100,000
                                    </div>
                                )}
                            </div>

                            {/* Total */}
                            <div className="pt-4 border-t border-gray-700 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-white">Total:</span>
                                    <span className="text-3xl font-bold text-green-400">
                                        COP {formatPrice(calculateTotal(), 'COP')}
                                    </span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </Button>

                            {/* Security Badge */}
                            <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Secure checkout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}