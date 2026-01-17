import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ShopLayout({children} : {children: React.ReactNode}) {
    return (
        <div className="min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">
            <div className="mx-auto flex min-h-screen flex-col">
                
                {/* Navbar */}
                <div className="w-full max-w-7xl mx-auto sticky top-5 z-50 mt-4">
                    <Navbar />
                </div>

                {/* Contenido */}
                <main className="flex-1 py-6">
                    {children}
                </main>

                {/* Footer */}
                <div className="w-full">
                    <Footer />
                </div>
            </div>
        </div>
    );
}
