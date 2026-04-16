import express from "express";
import { corsMiddleware } from "./config/cors.js";

import cartRoutes from "./routes/cart.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";
import userRoutes from "./routes/user.routes.js";

export const app = express();

app.use(corsMiddleware);
app.options('/.*/', corsMiddleware);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/", productRoutes);
app.use("/", categoryRoutes);
app.use("/", favoritesRoutes);
app.use("/users", userRoutes);
app.use("/", cartRoutes);