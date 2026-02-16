import express from "express";
import cors from "cors";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import favoritesRoutes from "./routes/favorites.routes";
import cartRoutes from "./routes/cart.routes";

export const app = express();

app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/", productRoutes);
app.use("/", categoryRoutes);
app.use("/", favoritesRoutes);
app.use("/", cartRoutes);