import { Request, RequestHandler, Response } from "express";
import crypto from "crypto";
import verificationTokenModel from "@/models/verificationModel";
import UserModel from "@/models/user";

export const generateAuthLink: RequestHandler = async (req, res) => {
  //generate authentication link
  // send that link to users email
  /*Genrate unique tokens for every users
  Store that token securely inside the database so that we can validate in future
  create a link which include that secure token and user information
  send that link to user emails 
  notify user to look the email for login link

  */

  const { email } = req.body;
  let user = await UserModel.findOne({ email });

  if (!user) {
    // if no user found create one
    user = await UserModel.create({ email });
  }

  const randomToken = crypto.randomBytes(36).toString("hex");

  await verificationTokenModel.create<{ userId: string }>({
    userId: user._id.toString(),
    token: randomToken,
  });

  console.log(req.body);
  res.json({ ok: true });
};
