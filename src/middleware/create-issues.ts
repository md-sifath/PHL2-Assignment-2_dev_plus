import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized access!",
      });
    }
    const decode = jwt.verify(
      token as string,
      config.jwt_secret as string,
    ) as JwtPayload;

    req.user = decode;
    next();
  };
};

export default auth;
