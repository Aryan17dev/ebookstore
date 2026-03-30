import express from "express";
import "dotenv/config";
import "@/db/connect";
import authRouter from "./routes/auth";

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Your app is listening on PORT ${port}`);
});
