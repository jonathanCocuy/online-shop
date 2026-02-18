"use client";

import { useState, useEffect } from "react"; 
import { cartService } from "@/lib/cart";

export function useCartCount() {
    const [count, setCount] = useState(0);

    const refresh = async () => {
        try {
            const total = await cartService.getCart().then(items => items.length);
            setCount(total);
        } catch (error) {
            setCount(0);
        }
    };

    useEffect(() => {
        let isActive = true;
        if (isActive) refresh();
        const cleanup = cartService.subscribe(refresh);
        return () => {
            isActive = false;
            cleanup?.();
        };
    }, []);

    return { count, refresh };
}
