import { Resend } from "resend";
import nodemailer from "nodemailer";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApplicationEmail({
  employerEmail,
  jobTitle,
  applicantName,
}: {
  employerEmail: string;
  jobTitle: string;
  applicantName: string;
}): Promise<void> {
  await resend.emails.send({
    from: "Hired. <noreply@hired.app>",
    to: employerEmail,
    subject: `New application for: ${jobTitle}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0A0A0F;">New Application Received</h2>
        <p style="color: #5A5875;">
          <strong style="color: #0A0A0F;">${applicantName}</strong> 
          applied for <strong style="color: #0A0A0F;">${jobTitle}</strong>.
        </p>
        <a href="${process.env.NEXTAUTH_URL}/dashboard" 
           style="display: inline-block; background: #6C63FF; color: white; 
                  padding: 12px 24px; border-radius: 8px; text-decoration: none;
                  font-size: 14px; margin-top: 16px;">
          View Application
        </a>
      </div>
    `,
  });
}

export async function sendStatusUpdateEmail({
  applicantEmail,
  jobTitle,
  status,
}: {
  applicantEmail: string;
  jobTitle: string;
  status: string;
}): Promise<void> {
  const statusLabels: Record<string, string> = {
    reviewed: "Your application has been reviewed",
    shortlisted: "Congratulations — you have been shortlisted",
    rejected: "Update on your application",
  };

  const label = statusLabels[status] ?? "Update on your application";

  await resend.emails.send({
    from: "Hired. <noreply@hired.app>",
    to: applicantEmail,
    subject: `${label} — ${jobTitle}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0A0A0F;">${label}</h2>
        <p style="color: #5A5875;">
          Your application for <strong style="color: #0A0A0F;">${jobTitle}</strong> 
          has been updated to <strong style="color: #0A0A0F;">${status}</strong>.
        </p>
        <a href="${process.env.NEXTAUTH_URL}/applications" 
           style="display: inline-block; background: #6C63FF; color: white; 
                  padding: 12px 24px; border-radius: 8px; text-decoration: none;
                  font-size: 14px; margin-top: 16px;">
          View My Applications
        </a>
      </div>
    `,
  });
}

export async function sendJobAlertEmail({
  to,
  jobs,
  keyword,
}: {
  to: string;
  jobs: Array<{ title: string; company: string; _id: string }>;
  keyword: string;
}): Promise<void> {
  const jobList = jobs
    .map(
      (job) => `
      <li style="margin-bottom: 12px;">
        <a href="${process.env.NEXTAUTH_URL}/jobs/${job._id}" 
           style="color: #6C63FF; text-decoration: none; font-weight: 500;">
          ${job.title}
        </a>
        <span style="color: #5A5875;"> — ${job.company}</span>
      </li>
    `
    )
    .join("");

  await resend.emails.send({
    from: "Hired. <noreply@hired.app>",
    to,
    subject: `${jobs.length} new jobs matching "${keyword}"`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0A0A0F;">Your Daily Job Alert</h2>
        <p style="color: #5A5875;">
          ${jobs.length} new job${jobs.length > 1 ? "s" : ""} matching 
          <strong style="color: #0A0A0F;">"${keyword}"</strong> posted in the last 24 hours:
        </p>
        <ul style="list-style: none; padding: 0; margin: 16px 0;">
          ${jobList}
        </ul>
        <a href="${process.env.NEXTAUTH_URL}/jobs?search=${encodeURIComponent(keyword)}" 
           style="display: inline-block; background: #6C63FF; color: white; 
                  padding: 12px 24px; border-radius: 8px; text-decoration: none;
                  font-size: 14px; margin-top: 8px;">
          View All Results
        </a>
      </div>
    `,
  });
}

export async function sendVerificationEmail({
  to,
  token,
}: {
  to: string;
  token: string;
}): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verificationLink = `${appUrl}/api/auth/verify?token=${token}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px; background-color: #ffffff;">
      <h2 style="color: #333333; text-align: center;">Welcome to Hired!</h2>
      <p style="color: #555555; font-size: 16px; line-height: 1.5;">
        Thank you for registering. To ensure the security of your account and to start using our platform, please verify your email address by clicking the button below.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="background-color: #6C63FF; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email Address</a>
      </div>
      <p style="color: #777777; font-size: 14px; text-align: center;">
        If you did not create an account, no further action is required.
      </p>
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
      <p style="color: #aaaaaa; font-size: 12px; text-align: center;">
        &copy; ${new Date().getFullYear()} Hired. All rights reserved.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Hired" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: "Verify your email address - Hired",
      html: htmlContent,
    });
    console.log(`Verification email sent to ${to}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    // Don't throw to avoid crashing registration if email fails during dev, but ideally this should be handled
  }
}

export async function sendRegisterOTPEmail({
  to,
  otp,
}: {
  to: string;
  otp: string;
}): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px; background-color: #ffffff;">
      <h2 style="color: #333333; text-align: center;">Verify your Hired account</h2>
      <p style="color: #555555; font-size: 16px; line-height: 1.5;">
        Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address. This code is valid for 10 minutes.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #6C63FF; padding: 10px 20px; border: 2px dashed #6C63FF; border-radius: 8px; background-color: #fbfbfe; display: inline-block;">
          ${otp}
        </span>
      </div>
      <p style="color: #777777; font-size: 14px; text-align: center;">
        If you did not request this code, you can safely ignore this email.
      </p>
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
      <p style="color: #aaaaaa; font-size: 12px; text-align: center;">
        &copy; ${new Date().getFullYear()} Hired. All rights reserved.
      </p>
    </div>
  `;

  // Log in development so we can bypass lack of local SMTP setup
  if (process.env.NODE_ENV === "development") {
    console.log("-----------------------------------------");
    console.log(`[DEV ONLY] OTP for ${to}: ${otp}`);
    console.log("-----------------------------------------");
  }

  try {
    await transporter.sendMail({
      from: `"Hired" <${process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@hired.app"}>`,
      to,
      subject: "Your Registration Verification Code - Hired",
      html: htmlContent,
    });
    console.log(`Verification OTP email sent to ${to}`);
  } catch (error) {
    console.error("Error sending verification OTP email:", error);
    if (process.env.NODE_ENV !== "development") {
      throw new Error("Could not send verification email. Please try again later.");
    }
  }
}

export async function sendPasswordResetEmail({
  to,
  token,
}: {
  to: string;
  token: string;
}): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetLink = `${appUrl}/auth/reset-password?token=${token}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px; background-color: #ffffff;">
      <h2 style="color: #333333; text-align: center;">Reset your Hired password</h2>
      <p style="color: #555555; font-size: 16px; line-height: 1.5;">
        You recently requested to reset your password for your Hired account. Click the button below to reset it. <strong>This link is only valid for 1 hour.</strong>
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #6C63FF; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #777777; font-size: 14px; text-align: center;">
        If you did not request a password reset, please ignore this email or contact support if you have concerns.
      </p>
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
      <p style="color: #aaaaaa; font-size: 12px; text-align: center;">
        &copy; ${new Date().getFullYear()} Hired. All rights reserved.
      </p>
    </div>
  `;

  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.log("-----------------------------------------");
    console.log(`[DEV ONLY] Password Reset Link for ${to}:`);
    console.log(resetLink);
    console.log("-----------------------------------------");
  }

  try {
    await transporter.sendMail({
      from: `"Hired" <${process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@hired.app"}>`,
      to,
      subject: "Reset your password - Hired",
      html: htmlContent,
    });
    console.log(`Password reset email sent to ${to}`);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    if (process.env.NODE_ENV !== "development") {
      throw new Error("Could not send password reset email. Please try again later.");
    }
  }
}