import dns from "dns";
import { promisify } from "util";

const resolveMx = promisify(dns.resolveMx);

// A list of common disposable/temporary email provider domains
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "yopmail.com",
  "10minutemail.com",
  "tempmail.com",
  "guerrillamail.com",
  "sharklasers.com",
  "dispostable.com",
  "getairmail.com",
  "maildrop.cc",
  "mintemail.com",
  "temp-mail.org",
  "throwawaymail.com",
  "generator.email",
  "tempmailaddress.com",
  "guerrillamailblock.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.biz",
]);

/**
 * Validates whether the email domain has valid MX records and is not a disposable email.
 */
export async function validateEmailRealness(email: string): Promise<{
  isValid: boolean;
  error?: string;
}> {
  const parts = email.toLowerCase().trim().split("@");
  if (parts.length !== 2) {
    return { isValid: false, error: "Invalid email format" };
  }

  const domain = parts[1];

  // 1. Check if domain is in the disposable blacklist
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { isValid: false, error: "Temporary or disposable emails are not allowed." };
  }

  // 2. Perform MX record lookup to check if the domain actually has mail servers set up
  try {
    const mxRecords = await resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return { isValid: false, error: "The email domain does not have active mail servers." };
    }
  } catch (err: any) {
    console.warn(`MX DNS resolution failed for domain: ${domain}`, err.message);
    
    // If the domain definitely does not exist (ENOTFOUND) or has no mail servers configured (ENODATA)
    if (err.code === "ENOTFOUND" || err.code === "ENODATA") {
      return {
        isValid: false,
        error: "This email domain does not exist or cannot receive emails. Please check for typos (e.g. gamil.com, yaho.com).",
      };
    }
    
    // For other system/network/DNS-server errors (e.g., ECONNREFUSED, ETIMEOUT), we fail-open
    // to prevent blocking legitimate users during transient resolver outages or offline local development.
    console.info(`DNS resolution failed open for domain ${domain} (error code: ${err.code || "unknown"})`);
  }

  return { isValid: true };
}
