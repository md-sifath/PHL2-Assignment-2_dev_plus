import type { Request, Response } from "express";
import { hash } from "bcrypt";
import { authService } from "./auth-service";

const userSignup = async (req: Request, res: Response) => {
  try {
    const result = await authService.userSignupIntoDB(req.body);
    console.log(result);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const authController = {
  userSignup,
};
