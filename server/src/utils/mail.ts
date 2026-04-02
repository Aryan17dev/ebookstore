import nodemailer from "nodemailer";

interface verificationMailOptions {
  link: string;
  to: string;
}

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_TEST_USER,
    pass: process.env.MAILTRAP_TEST_PASS,
  },
});

const mail = {
  async sendVerificationMail(options: verificationMailOptions) {
    await transport.sendMail({
      to: options.to,
      from: process.env.VERIFICATION_MAIL,
      subject: "Auth Verification",
      html: `
    <div>
    <p>Please Click on this <a href="${options.link}">Link</a> to verify Your Account</p>
    </div>
    `,
    });
  },
};

export default mail;
