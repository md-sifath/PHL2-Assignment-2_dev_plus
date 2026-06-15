import express, { type Application } from "express";
import { authRoute } from "./modules/auth/auth-route";
import { issuesRoute } from "./modules/issues/issues-route";
import auth from "./middleware/create-issues";

const app: Application = express();

app.use(express.json());

// ROUTE HANDLER
app.use("/api/auth", authRoute);
app.use("/api/issues", issuesRoute);

export default app;
