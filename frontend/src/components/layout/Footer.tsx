"use client";

import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";


export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Copyright */}
                    <p className="text-sm text-gray-400">
                        © {currentYear} On-Shop. All rights reserved.
                    </p>

                    {/* Social Media */}
                    <div className="flex gap-3">
                        <a href="#" className="bg-slate-700 p-2 rounded-lg hover:bg-slate-600 transition-all hover:scale-110">
                            <Facebook size={18} />
                        </a>
                        <a href="#" className="bg-slate-700 p-2 rounded-lg hover:bg-slate-600 transition-all hover:scale-110">
                            <Instagram size={18} />
                        </a>
                        <a href="#" className="bg-slate-700 p-2 rounded-lg hover:bg-slate-600 transition-all hover:scale-110">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                        <a href="#" className="bg-slate-700 p-2 rounded-lg hover:bg-slate-600 transition-all hover:scale-110">
                            <Youtube size={18} />
                        </a>
                    </div>

                    {/* Legal Links */}
                    <div className="flex gap-4 text-sm text-gray-400">
                        <Link href="#" className="hover:text-white transition-colors">
                            Privacy
                        </Link>
                        <Link href="#" className="hover:text-white transition-colors">
                            Terms
                        </Link>
                        <Link href="#" className="hover:text-white transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}