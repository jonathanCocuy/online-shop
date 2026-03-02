'use client';


import LightRaysBackground from '@/components/layout/LightRaysBackground';
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
            <div className="relative overflow-hidden font-sans">
                <div className="absolute inset-0 -z-10">
                    <LightRaysBackground />
                </div>
            
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="w-full h-full">
                        {children}
                    </div>
                </div>
            </div>
        );
}