'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingBag, Tag, Truck, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Swal from 'sweetalert2';
import CartCard from '@/components/cart/CartCard';
import { cartService, type CartItem } from '@/lib/cart';
import { authService } from '@/lib/auth';

const CURRENCY_CONFIG = {
    COP: { decimals: 0, locale: 'es-CO', symbol: '$' },
    USD: { decimals: 2, locale: 'en-US', symbol: '$' },
    EUR: { decimals: 2, locale: 'de-DE', symbol: '€' },
    GBP: { decimals: 2, locale: 'en-GB', symbol: '£' },
};

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const fetchCart = useCallback(async () => {
        if (!authService.isAuthenticated()) {
            setError('Log in to view your cart.');
            setCartItems([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const items = await cartService.getCart();
            setCartItems(items);
            setError(null);
        } catch (err) {
            console.error('Failed to load cart', err);
            setError('Unable to load cart items.');
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
        const cleanup = cartService.subscribe(fetchCart);
        return () => cleanup?.();
    }, [fetchCart]);

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

        const item = cartItems.find((c) => c.id === id);
        if (!item) return;

        if (newQuantity > item.stock) {
            Swal.fire({
                title: 'Stock Limit',
                text: `Only ${item.stock} units available`,
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            return;
        }

        setCartItems((prev) =>
            prev.map((c) => (c.id === id ? { ...c, quantity: newQuantity } : c))
        );
    };

    const removeItem = async (id: string) => {
        const item = cartItems.find((c) => c.id === id);
        if (!item) return;

        const result = await Swal.fire({
            title: 'Remove Item?',
            text: 'Are you sure you want to remove this item from cart?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, remove it',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) return;

        // Optimistic update
        const previousItems = cartItems;
        setCartItems((prev) => prev.filter((c) => c.id !== id));

        try {
            await cartService.removeFromCart(item.productId);
            Swal.fire({
                title: 'Removed!',
                text: 'Item removed from cart',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            // Rollback on API error
            console.error('Failed to remove item', err);
            setCartItems(previousItems);
            Swal.fire({
                title: 'Error',
                text: 'Could not remove the item from cart.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    const calculateSubtotal = () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const calculateDiscount = () => (calculateSubtotal() * discount) / 100;
    const calculateShipping = () => (calculateSubtotal() >= 100 ? 0 : 10);
    const calculateTotal = () => calculateSubtotal() - calculateDiscount() + calculateShipping();

    const handleCheckout = async () => {
        const result = await Swal.fire({
            title: 'Proceed to Checkout?',
            text: `Total: COP ${formatPrice(calculateTotal(), 'COP')}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3B82F6',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, proceed',
            cancelButtonText: 'Continue Shopping',
        });

        if (result.isConfirmed) {
            Swal.fire({ title: 'Processing...', text: 'Redirecting to checkout', icon: 'success', timer: 2000, showConfirmButton: false });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-400">Loading cart…</p>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-12 border border-gray-700 inline-block mb-6">
                        <ShoppingBag size={80} className="text-gray-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
                    <p className="text-gray-400 mb-8">
                        {error ?? 'Start adding some products to your cart!'}
                    </p>
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
        <div className="max-w-7xl w-full min-h-screen">
            {/* Header */}
            <div className="relative overflow-hidden w-full pl-4 mt-6 mb-6 lg:mt-10 lg:mb-10">
                <div className="relative max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0">
                        <div className="flex flex-col items-start justify-center gap-1 lg:gap-2">
                            <h1 className="text-2xl lg:text-5xl font-bold text-white flex items-center gap-2 lg:gap-3">
                                <ShoppingCart className="w-6 h-6 lg:w-10 lg:h-10" />
                                Shopping Cart
                            </h1>
                            <p className="text-gray-400 text-sm lg:text-lg">Your shopping cart</p>
                            <p className="text-gray-400 font-bold text-sm lg:text-lg">
                                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {error && (
                            <div className="text-sm text-red-300 text-center">{error}</div>
                        )}
                        {cartItems.map((item) => {
                            const currencySymbol =
                                CURRENCY_CONFIG[item.currency as keyof typeof CURRENCY_CONFIG]?.symbol ||
                                item.currency;
                            return (
                                <CartCard
                                    key={item.id}
                                    item={item}
                                    currencySymbol={currencySymbol}
                                    formatPrice={formatPrice}
                                    onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
                                    onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                                    onRemove={() => removeItem(item.id)}
                                />
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sticky top-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal:</span>
                                    <span className="text-white font-semibold">
                                        USD {formatPrice(calculateSubtotal(), 'USD')}
                                    </span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Discount ({discount}%):</span>
                                        <span className="font-semibold">
                                            -USD {formatPrice(calculateDiscount(), 'USD')}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-400">
                                    <span className="flex items-center gap-2">
                                        <Truck size={16} />
                                        Shipping:
                                    </span>
                                    <span className={`font-semibold ${calculateShipping() === 0 ? 'text-green-400' : 'text-white'}`}>
                                        {calculateShipping() === 0 ? 'FREE' : `USD ${formatPrice(calculateShipping(), 'USD')}`}
                                    </span>
                                </div>
                                {calculateShipping() > 0 && (
                                    <div className="text-xs text-gray-500">
                                        Free shipping on orders over USD 100,000
                                    </div>
                                )}
                            </div>

                            {/* Total */}
                            <div className="pt-4 border-t border-gray-700 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-white">Total:</span>
                                    <span className="text-xl font-bold text-green-400">
                                        USD {formatPrice(calculateTotal(), 'USD')}
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </Button>

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
