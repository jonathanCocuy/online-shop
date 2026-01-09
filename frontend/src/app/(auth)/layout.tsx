'use client';

import AuroraBackground from '@/components/backgrounds/Aurora';

export default function AuthLayout({ children }: { children: React.ReactNode }) {

    return (
            <div className="relative min-h-screen overflow-hidden font-sans">
                <div className="absolute inset-0 -z-10">
                    <AuroraBackground />
                </div>
            
                <div className="relative z-10 flex min-h-screen items-center justify-center">
                    <div className="w-full max-w-md px-4">
                        {children}
                    </div>
                </div>
            </div>
        );
}