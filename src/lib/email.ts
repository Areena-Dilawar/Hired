import { Resend } from "resend";

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