import type { Request, Response } from "express";
import { hash } from "bcrypt";
import { authService } from "./auth-service";

const userSignup = async (req: Request, res: Response) => {
  try {
    const result = await authService.userSignupIntoDB(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "User can not Register",
      errors: error.message,
    });
  }
};

const userLogin = async (req: Request, res: Response) => {
  try {
    const result = await authService.userLoginIntoDB(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {}
};

export const authController = {
  userSignup,
  userLogin,
};
