import { generateAuthLink } from "@/controllers/auth";
import { emailValidationSchema, validate } from "@/middlewares/validators";
import { Router } from "express";

const authRouter = Router();

authRouter.post(
  "/generate-link",
  validate(emailValidationSchema),
  generateAuthLink,
);

export default authRouter;
