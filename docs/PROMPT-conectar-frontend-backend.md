# Prompt: Conectar el frontend con el backend (categorías, favoritos, carrito)

Copia y pega el siguiente prompt para que el frontend use las APIs reales del backend.

---

## Prompt (copiar desde aquí)

```
Necesito conectar el frontend Next.js de este proyecto con el backend Express que ya tiene estas APIs:

**Base URL:** `process.env.NEXT_PUBLIC_API_URL` (ej: http://localhost:4000)

**Rutas del backend:**

1. **Categorías**
   - `GET /categories` → lista de categorías (array con `id`, `name`, etc.)
   - `GET /categories/:id` → una categoría por id (el backend usa `id` numérico, no slug)
   - `GET /categories/:id/products` → productos de esa categoría (array de productos)

2. **Favoritos** (todas requieren autenticación: header `Authorization: Bearer <token>`)
   - `GET /favorites` → lista de productos favoritos del usuario
   - `POST /favorites/:productId` → añadir producto a favoritos (productId es el id numérico del producto)
   - `DELETE /favorites/:productId` → quitar producto de favoritos

3. **Carrito** (todas requieren autenticación: header `Authorization: Bearer <token>`)
   - `GET /cart` → items del carrito (array con `id`, `product_id`, `quantity`, `name`, `price`, `image_url`, `currency`, `stock`, etc.)
   - `POST /cart/:productId` → añadir al carrito (body opcional: `{ "quantity": 1 }`)
   - `PATCH /cart/:productId` → actualizar cantidad (body: `{ "quantity": 3 }`; si quantity es 0 se quita del carrito)
   - `DELETE /cart/:productId` → quitar del carrito

**Token:** El login ya guarda el token en `localStorage` con `authService.setToken(data.token)`. Para las rutas protegidas hay que enviar en cada request: `Authorization: Bearer ${authService.getToken()}`.

**Estado actual del frontend:**
- La página de favoritos (`app/(shop)/favorites/page.tsx`) hoy carga productos con `productService.getProducts()` y muestra solo los primeros 4; el “eliminar” es solo estado local. Hay que cambiarla para usar GET /favorites (con token) y DELETE /favorites/:productId; y en las tarjetas de producto, poder añadir a favoritos con POST /favorites/:productId (con token).
- La página del carrito (`app/(shop)/cart/page.tsx`) usa datos mock en `useState`. Hay que usar GET /cart (con token) para cargar, POST para añadir, PATCH para cambiar cantidad y DELETE para quitar. Ajustar tipos si el backend devuelve `product_id` en lugar de `id` en cada item.
- La página de categorías (`app/(shop)/categories/page.tsx`) filtra productos por `product.category === params.slug`. El backend tiene GET /categories/:id/products. Hay que usar el id de categoría (o mapear slug/name a id) y llamar a GET /categories/:id/products para obtener los productos de esa categoría en lugar de traer todos y filtrar por texto.
- En el login, después de recibir el token del backend, guardarlo con `authService.setToken(data.token)` para que favoritos y carrito puedan enviarlo.

**Tareas:**
1. Crear un servicio de API para favoritos (por ejemplo `src/lib/favorites.ts`) con getFavorites(), addFavorite(productId), removeFavorite(productId), enviando siempre el header Authorization con el token. Si no hay token, no hacer la petición o redirigir a login según la UX que prefieras.
2. Crear un servicio de API para el carrito (por ejemplo `src/lib/cart.ts`) con getCart(), addToCart(productId, quantity?), updateQuantity(productId, quantity), removeFromCart(productId), enviando siempre el header Authorization con el token.
3. En la página de favoritos: cargar con getFavorites(), eliminar con removeFavorite(productId), y mostrar estado de carga y vacío. Opcional: en ProductCard o página de detalle, botón “Añadir a favoritos” que llame a addFavorite(productId) cuando el usuario esté logueado.
4. En la página del carrito: cargar con getCart(), actualizar cantidad con updateQuantity(), quitar con removeFromCart(), y añadir al carrito desde otros sitios con addToCart(productId, quantity). Normalizar el formato de cada item del carrito (el backend devuelve product_id, name, price, quantity, etc.) al tipo que use CartCard (id puede ser product_id o el id del cart_item según lo que muestres).
5. Categorías: en la página de categoría por slug, obtener el id de la categoría (por ejemplo desde GET /categories buscando por name o usando rutas como /categories/[id] si cambias a id). Llamar a GET /categories/:id/products para obtener los productos de esa categoría y mostrarlos, en lugar de getProducts() y filtrar por category.
6. Ajustar tipos TypeScript si el backend devuelve `id` como number; en frontend a veces se usa como string (ej. product.id), normalizar o usar String(id) donde haga falta para keys y comparaciones.

Haz los cambios en el frontend sin modificar el backend. Usa el estilo actual del proyecto (fetch con NEXT_PUBLIC_API_URL, authService.getToken(), etc.).
```

---

## Resumen rápido de APIs (referencia)

| Recurso    | Método | Ruta                         | Auth | Body / Notas                    |
|-----------|--------|------------------------------|------|---------------------------------|
| Categorías | GET   | `/categories`                | No   | Lista categorías                |
| Categoría  | GET   | `/categories/:id`           | No   | Una categoría                   |
| Productos por categoría | GET | `/categories/:id/products`   | No   | Productos de esa categoría      |
| Favoritos | GET   | `/favorites`                 | Sí   | Lista productos favoritos       |
| Favoritos | POST  | `/favorites/:productId`     | Sí   | Añadir favorito                 |
| Favoritos | DELETE| `/favorites/:productId`     | Sí   | Quitar favorito                 |
| Carrito   | GET   | `/cart`                      | Sí   | Items del carrito               |
| Carrito   | POST  | `/cart/:productId`          | Sí   | Opcional: `{ "quantity": 1 }`  |
| Carrito   | PATCH | `/cart/:productId`          | Sí   | `{ "quantity": N }` (0 = quitar)|
| Carrito   | DELETE| `/cart/:productId`          | Sí   | Quitar del carrito              |

**Header para rutas con Auth:**  
`Authorization: Bearer <token>`  
Token: `localStorage` (guardado en login con `authService.setToken(data.token)`).
