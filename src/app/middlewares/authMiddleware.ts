import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { envVars } from "../config/env";

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded: any = jwt.verify(token, envVars.JWT_ACCESS_SECRET);
    req.user = {
      id: decoded.userId, 
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// src/middlewares/roleAuth.ts
export const authorizeRoles = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  };
};

