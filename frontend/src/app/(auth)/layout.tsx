'use client';


import AuroraBackground from '@/components/backgrounds/Aurora';
import LightRaysBackground from '@/components/layout/LightRaysBackground';
import { useRouter } from 'next/navigation';
export default function AuthLayout({ children }: { children: React.ReactNode }) {

    const router = useRouter();

    return (
            <div className="relative min-h-screen overflow-hidden font-sans">
                <div className="absolute inset-0 -z-10">
                    <LightRaysBackground />
                </div>
            
                <div className="relative z-10 flex min-h-screen items-center justify-center">
                    <div className="w-full h-full">
                        {children}
                    </div>
                </div>
            </div>
        );
}