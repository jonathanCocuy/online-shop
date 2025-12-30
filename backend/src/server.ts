import express from "express";
import cors from "cors";
import { env } from "./config/env";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});