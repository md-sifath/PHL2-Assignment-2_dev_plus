import express, { type Application } from "express";
import { authRoute } from "./modules/auth/auth-route";

const app: Application = express();

app.use(express.json());

// ROUTE HANDLER
app.use("/api/auth", authRoute);

export default app;
