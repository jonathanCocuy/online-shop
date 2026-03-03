import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import AuthBackground from './shared/AuthBackground';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative overflow-hidden font-sans min-h-screen">
            <div className="absolute inset-0 -z-10">
                <AuthBackground />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
                {/* Visible solo en pantallas < 640px */}
                <div className="flex items-center justify-center w-full p-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:scale-105 active:scale-95"
                    >
                        <FaArrowLeft /> Back to Home
                    </Link>
                </div>

                <div className="w-full sm:min-h-[700px]">
                    {children}
                </div>
            </div>
        </div>
    );
}