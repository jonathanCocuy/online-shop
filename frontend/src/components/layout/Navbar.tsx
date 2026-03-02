"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, User, Heart, LogOut, House, Package, List } from "lucide-react";
import { authService } from "@/lib/auth";
import Image from "next/image";
import Swal from "sweetalert2";
import { useCartCount } from "@/hooks/useCartCount";
import { Button } from "../ui/Button";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { count } = useCartCount();

    // Determinar el enlace activo basado en la ruta actual
    const getActiveLink = () => {
        if (pathname === '/') return 'Home';
        if (pathname.startsWith('/products')) return 'Products';
        if (pathname.startsWith('/categories')) return 'Categories';
        if (pathname.startsWith('/contact')) return 'Contact';
        if (pathname.startsWith('/favorites')) return 'Favorites';
        if (pathname.startsWith('/cart')) return 'Cart';
        if (pathname.startsWith('/dashboard/client')) return 'Dashboard';
        return '';
    };

    const activeLink = getActiveLink();

    const handleLogout = () => {
        setIsOpen(false);
        Swal.fire({
            title: 'Are you sure you want to logout?',
            text: 'You will be logged out of your account',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Logout',
            confirmButtonColor: '#3B82F6',
            cancelButtonColor: '#6B7280',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                authService.logout();
                setIsAuthenticated(false);
                router.push('/');
            }
        });
    }

    useEffect(() => {
        setIsAuthenticated(authService.isAuthenticated());
        setIsClient(true);
    }, []);

    return (
        <nav className={`bg-white shadow-sm sticky top-0 z-50 rounded-lg ${isOpen ? "rounded-bl-none rounded-br-none transition-all duration-300" : "rounded-bl-lg rounded-br-lg transition-all duration-300"} lg:rounded-lg`}>
            {/* Blur effect for the top margin area */}
            <div className="absolute -top-5 -left-5 -right-5 h-5 backdrop-blur-md -z-10"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <div className="rounded-lg">
                                <Image src="/images/login-logo.png" alt="Logo" width={50} height={50} className="sm: w-10 h-10"  />
                            </div>
                            <span className="text-lg lg:text-2xl font-bold text-slate-800">
                                On-Shop
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center flex-1 justify-center space-x-8">
                        <Link
                            href="/" 
                            className={`text-gray-700 hover:text-slate-800 hover:scale-105 transition-all font-medium pb-1 ${
                                activeLink === "Home" ? "border-b-2 border-slate-800 font-semibold" : ""
                            }`}
                        >
                            Home
                        </Link>
                        <Link 
                            href="/products" 
                            className={`text-gray-700 hover:text-slate-800 hover:scale-105 transition-all font-medium pb-1 ${
                                activeLink === "Products" ? "border-b-2 border-slate-800 font-semibold" : ""
                            }`}
                        >
                            Products
                        </Link>
                        <Link 
                            href="/categories" 
                            className={`text-gray-700 hover:text-slate-800 hover:scale-105 transition-all font-medium pb-1 ${
                                activeLink === "Categories" ? "border-b-2 border-slate-800 font-semibold" : ""
                            }`}
                        >
                            Categories
                        </Link>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isClient && isAuthenticated && (
                            <>
                                <Link href="/favorites" className="p-2 text-gray-700 hover:text-slate-800 hover:scale-110 transition-all">
                                    {activeLink === "Favorites" ? <Heart size={20} fill="red" /> : <Heart size={20} />}
                                </Link>
                            </>
                        )}
                        <Link href="/cart" className="p-2 text-gray-700 hover:text-slate-800 hover:scale-110 transition-all relative">
                            {activeLink === "Cart" ? <ShoppingCart size={20} fill="blue" /> : <ShoppingCart size={20} />}
                            <span className="absolute -top-1 -right-1 bg-slate-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {count}
                            </span>
                        </Link>
                        <div className="p-2"></div>
                        <Link href="/dashboard/client" className="p-2 text-gray-700 hover:text-slate-800 hover:scale-110 transition-all">
                            {activeLink === "Dashboard" ? <User size={20} fill="green" /> : <User size={20} />}
                        </Link>
                        {isClient && isAuthenticated && (
                            <button className="p-2 text-gray-700 hover:text-slate-800 hover:scale-110 transition-all" onClick={handleLogout}>
                                <LogOut size={20} color="red" />
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-2 text-sm">
                        {!isClient || !isAuthenticated && (
                            <Button variant="primary" size="md" className="text-sm">
                                <Link href="/login">Login</Link>
                            </Button>
                        )}
                        {isClient && isAuthenticated && (
                            <>
                                <Link href="/dashboard/client" className="p-2 text-gray-700 hover:text-slate-800 hover:scale-110 transition-all">
                                    <User size={20} />
                                </Link>
                                <Link href="/cart" className="p-2 text-gray-700 hover:text-slate-800 hover:scale-110 transition-all relative">
                                    <ShoppingCart size={20} />
                                    <span className="absolute -top-1 -right-1 bg-slate-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {count}
                                    </span>
                                </Link>
                            </>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-gray-700 hover:text-slate-800"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                    key="mobile-menu"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="md:hidden absolute left-0 right-0 z-50 border-t border-gray-200 bg-white rounded-b-lg overflow-hidden shadow-lg"
                    >
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        {[
                        { href: "/", label: "Home", icon: <House size={20} />, name: "Home" },
                        { href: "/products", label: "Products", icon: <Package size={20} />, name: "Products" },
                        { href: "/categories", label: "Categories", icon: <List size={20} />, name: "Categories" },
                        ].map((item, i) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.2 }}
                        >
                            <Link
                            href={item.href}
                            className={`block px-3 py-2 rounded-md text-gray-700 hover:bg-slate-100 hover:text-slate-800 transition-colors flex items-center gap-2 ${
                                activeLink === item.name ? "bg-slate-800 text-white font-semibold" : ""
                            }`}
                            onClick={() => setIsOpen(false)}
                            >
                            {item.icon}
                            {item.label}
                            
                            </Link>
                        </motion.div>
                        ))}

                        {isClient && isAuthenticated && (
                        <>
                            <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.18, duration: 0.2 }}
                            >
                            <Link href="/favorites" className={`block px-3 py-2 rounded-md text-gray-700 hover:bg-slate-100 hover:text-slate-800 transition-colors flex items-center gap-2 ${activeLink === "Favorites" ? "bg-slate-800 text-white font-semibold" : ""}`} onClick={() => setIsOpen(false)}>
                                <Heart size={20} />
                                Favorites
                            </Link>
                            </motion.div>
                            <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.24, duration: 0.2 }}
                            >
                            <Link href="/" onClick={handleLogout} className="block px-3 py-2 rounded-md text-red-700 hover:bg-slate-100 hover:text-red-800 transition-colors flex items-center gap-2"
                            
                            >
                                <LogOut size={20} color="red" />
                                Logout
                            </Link>
                            </motion.div>
                        </>
                        )}
                    </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}