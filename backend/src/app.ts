import express from "express";
import { corsMiddleware } from "./config/cors";

import cartRoutes from "./routes/cart.routes";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import favoritesRoutes from "./routes/favorites.routes";

export const app = express();

app.use(express.json());
app.use(corsMiddleware);

app.use("/auth", authRoutes);
app.use("/", productRoutes);
app.use("/", categoryRoutes);
app.use("/", favoritesRoutes);
app.use("/", cartRoutes);