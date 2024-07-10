import  { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
/**
 * Middleware to validate request data against a provided Zod schema.
 *
 * @param schema The Zod schema to validate the request data against.
 * @returns A middleware function that parses the request body and either forwards the control to the next middleware or passes an error to the error handling middleware.
 */
const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body against the schema and proceed if successful
      await schema.parseAsync({
        body: req.body,
        cookies:req.cookies,
      });
      next();
    } catch (error) {
      // Pass any validation errors to the error handling middleware
      next(error);
    }
  };
};


export default validateRequest;