/**
 * Convierte image_url en URL absoluta.
 * Si viene solo el fragmento de Unsplash (ej: "photo-1591290619762-37788c84bde5?w=800"),
 * se devuelve la URL completa para que las imágenes carguen en el frontend.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
    if (!url || typeof url !== "string") return "";
    const t = url.trim();
    if (t.startsWith("http://") || t.startsWith("https://")) return t;
    if (t.startsWith("photo-") || t.includes("unsplash"))
        return "https://images.unsplash.com/" + (t.startsWith("/") ? t.slice(1) : t);
    return t;
}

export function withNormalizedImage<T extends { image_url?: string | null }>(item: T): T {
    if (!item) return item;
    return { ...item, image_url: normalizeImageUrl(item.image_url) };
}

export function withNormalizedImages<T extends { image_url?: string | null }>(items: T[] | null): T[] {
    if (!items || !Array.isArray(items)) return [];
    return items.map(withNormalizedImage);
}
