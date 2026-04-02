import { Request, RequestHandler, Response } from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import verificationTokenModel from "@/models/verificationModel";
import UserModel from "@/models/user";
import mail from "@/utils/mail";
import { formatUserProfile, sendErrorResponse } from "@/utils/helper";
import jwt from "jsonwebtoken";

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

  const userId: string = user._id.toString();

  await verificationTokenModel.findOneAndDelete({
    userId,
  });

  const randomToken = crypto.randomBytes(36).toString("hex");

  await verificationTokenModel.create({
    userId,
    token: randomToken,
  });

  const link = `${process.env.VERIFICATION_LINK}/verify?token=${randomToken}&userId=${userId}`;

  await mail.sendVerificationMail({
    link,
    to: user.email,
  });

  res.json({ message: "Please check your email for link." });
};

export const verifyAuthToken: RequestHandler = async (req, res) => {
  const { token, userId } = req.query;

  if (typeof token !== "string" || typeof userId !== "string") {
    return sendErrorResponse({
      status: 403,
      message: "Invalid Request",
      res,
    });
  }

  const verificationToken = await verificationTokenModel.findOne({ userId });

  if (!verificationToken || !verificationToken.compare(token)) {
    return sendErrorResponse({
      status: 403,
      message: "Invalid Request, token mismatch",
      res,
    });
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    return sendErrorResponse({
      status: 500,
      message: "Something went wrong",
      res,
    });
  }

  await verificationTokenModel.findByIdAndDelete(verificationToken._id);

  // TODO : authentication
  const payload = {
    userId: user._id,
  };

  const authToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15d",
  });

  res.cookie("authToken", authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  });

  // res.redirect(
  //   `${process.env.AUTH_SUCCESS_URL}?profile=${JSON.stringify(formatUserProfile(user))}`,
  // );

  res.send();
};

export const sendProfileInfo: RequestHandler = (req, res) => {
  res.json({
    profile: req.user,
  });
};
