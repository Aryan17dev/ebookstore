import { RequestHandler } from "express";
import { z, ZodRawShape } from "zod";

export const emailValidationSchema = {
  email: z
    .string({
      required_error: "Email is missing",
      invalid_type_error: "Invalid Email Type!",
    })
    .email("Invalid Email!"),
};

export const validate = <T extends ZodRawShape>(object: T): RequestHandler => {
  return (req, res, next) => {
    const schema = z.object(object);
    const result = schema.safeParse(req.body);
    if (result.success) {
      req.body = result.data;
      next();
    } else {
      const errors = result.error.flatten().fieldErrors;
      return res.status(422).json({ errors });
    }
  };
};
