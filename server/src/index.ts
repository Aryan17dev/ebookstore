import express from "express";
import "dotenv/config";
import "@/db/connect";
import "express-async-errors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import { errorHandler } from "./middlewares/error";

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", authRouter);
app.use(cookieParser())

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Your app is listening on PORT ${port}`);
});
