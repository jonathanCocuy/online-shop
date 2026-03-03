'use client';

import dynamic from 'next/dynamic';

const LightRaysBackground = dynamic(
    () => import('@/components/layout/LightRaysBackground'),
    { ssr: false }
);

export default function AuthBackground() {
    return <LightRaysBackground />;
}
