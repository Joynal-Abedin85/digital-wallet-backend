import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

const validateRequest =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors || error,
      });
    }
  };

export default validateRequest;
