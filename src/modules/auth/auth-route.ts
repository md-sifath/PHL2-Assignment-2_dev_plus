import { Router } from "express";
import { authController } from "./auth-controller";

const route = Router();

route.post("/signup", authController.userSignup);

export const authRoute = route;
