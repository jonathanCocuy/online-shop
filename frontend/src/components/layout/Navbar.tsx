"use client";

import { useState } from "react";
import { ShoppingCart, Search, Menu, X, User, Heart, ShoppingBag } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("Home");

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <div className="bg-slate-800 p-2 rounded-lg">
                                <ShoppingBag className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-bold text-slate-800">
                                On-Shop
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center flex-1 justify-center space-x-8">
                        <a 
                            href="#" 
                            onClick={() => setActiveLink("Home")}
                            className={`text-gray-700 hover:text-slate-800 hover:scale-105 transition-all font-medium pb-1 ${
                                activeLink === "Home" ? "border-b-2 border-slate-800 font-semibold" : ""
                            }`}
                        >
                            Home
                        </a>
                        <a 
                            href="#" 
                            onClick={() => setActiveLink("Products")}
                            className={`text-gray-700 hover:text-slate-800 hover:scale-105 transition-all font-medium pb-1 ${
                                activeLink === "Products" ? "border-b-2 border-slate-800 font-semibold" : ""
                            }`}
                        >
                            Products
                        </a>
                        <a 
                            href="#" 
                            onClick={() => setActiveLink("Categories")}
                            className={`text-gray-700 hover:text-slate-800 hover:scale-105 transition-all font-medium pb-1 ${
                                activeLink === "Categories" ? "border-b-2 border-slate-800 font-semibold" : ""
                            }`}
                        >
                            Categories
                        </a>
                        <a 
                            href="#" 
                            onClick={() => setActiveLink("Contact")}
                            className={`text-gray-700 hover:text-slate-800 hover:scale-105 transition-all font-medium pb-1 ${
                                activeLink === "Contact" ? "border-b-2 border-slate-800 font-semibold" : ""
                            }`}
                        >
                            Contact
                        </a>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button 
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="p-2 text-gray-700 hover:text-slate-800 hover:scale-110 transition-all"
                        >
                            <Search size={20} />
                        </button>
                        <button className="p-2 text-gray-700 hover:text-slate-800 hover:scale-110 transition-all">
                            <Heart size={20} />
                        </button>
                        <button className="p-2 text-gray-700 hover:text-slate-800 hover:scale-110 transition-all">
                            <User size={20} />
                        </button>
                        <button className="p-2 text-gray-700 hover:text-slate-800 hover:scale-110 transition-all relative">
                            <ShoppingCart size={20} />
                            <span className="absolute -top-1 -right-1 bg-slate-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                3
                            </span>
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <button className="p-2 text-gray-700 hover:text-slate-800 hover:scale-110 transition-all">
                            <User size={20} />
                        </button>
                        <button className="p-2 text-gray-700 hover:text-slate-800 hover:scale-110 transition-all relative">
                            <ShoppingCart size={20} />
                            <span className="absolute -top-1 -right-1 bg-slate-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                3
                            </span>
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-gray-700 hover:text-slate-800"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                {searchOpen && (
                    <div className="pb-4 animate-in fade-in slide-in-from-top-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar Products..."
                                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <a
                            href="#"
                            onClick={() => setActiveLink("Home")}
                            className={`block px-3 py-2 rounded-md text-gray-700 hover:bg-slate-100 hover:text-slate-800 transition-colors ${
                                activeLink === "Home" ? "bg-slate-800 text-white font-semibold" : ""
                            }`}
                        >
                            Home
                        </a>
                        <a
                            href="#"
                            onClick={() => setActiveLink("Products")}
                            className={`block px-3 py-2 rounded-md text-gray-700 hover:bg-slate-100 hover:text-slate-800 transition-colors ${
                                activeLink === "Products" ? "bg-slate-800 text-white font-semibold" : ""
                            }`}
                        >
                            Products
                        </a>
                        <a
                            href="#"
                            onClick={() => setActiveLink("Categories")}
                            className={`block px-3 py-2 rounded-md text-gray-700 hover:bg-slate-100 hover:text-slate-800 transition-colors ${
                                activeLink === "Categories" ? "bg-slate-800 text-white font-semibold" : ""
                            }`}
                        >
                            Categories
                        </a>
                        <a
                            href="#"
                            onClick={() => setActiveLink("Contact")}
                            className={`block px-3 py-2 rounded-md text-gray-700 hover:bg-slate-100 hover:text-slate-800 transition-colors ${
                                activeLink === "Contact" ? "bg-slate-800 text-white font-semibold" : ""
                            }`}
                        >
                            Contact
                        </a>
                        <div className="pt-4 border-t border-gray-200 mt-4 flex space-x-4 px-3">
                            <button className="p-2 text-gray-700 hover:text-slate-800">
                                <Search size={20} />
                            </button>
                            <button className="p-2 text-gray-700 hover:text-slate-800">
                                <Heart size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}