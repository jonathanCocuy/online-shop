'use client';

import LightRaysBackground from '@/components/layout/LightRaysBackground';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative overflow-hidden font-sans min-h-screen">
            <div className="absolute inset-0 -z-10">
                <LightRaysBackground />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
                {/* Visible solo en pantallas < 640px */}
                <div className="sm:hidden flex items-center justify-center w-full p-4">
                    <Button variant="primary" size="lg">
                        <Link href="/" className="flex items-center gap-2">
                            <FaArrowLeft /> Back
                        </Link>
                    </Button>
                </div>

                <div className="w-full h-[700px]">
                    {children}
                </div>
            </div>
        </div>
    );
}