import nodemailer, { Transporter } from "nodemailer";

export class EmailService {
  private static cleanCredentials(): { user: string; pass: string } | null {
    const rawUser = process.env.EMAIL_USER?.trim() || "";
    const rawPass = process.env.EMAIL_PASS?.trim() || "";

    // Strip wrapping quotes and whitespace often added by accident in cloud environment panels
    const user = rawUser.replace(/^["']|["']$/g, "").trim();
    const pass = rawPass.replace(/^["']|["']$/g, "").replace(/\s+/g, "").trim();

    if (!user || !pass) {
      console.warn("[EmailService] EMAIL_USER or EMAIL_PASS environment variable is missing.");
      return null;
    }

    return { user, pass };
  }

  private static createTransporter(port: number, secure: boolean): Transporter | null {
    const creds = this.cleanCredentials();
    if (!creds) return null;

    const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: creds.user,
        pass: creds.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }

  static async sendVerificationCode(toEmail: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
      const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f7f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #121212;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f7f9; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #eaeaea;">
          <!-- Header -->
          <tr>
            <td style="background-color: #000000; padding: 28px 36px; text-align: center;">
              <div style="color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: 1px; display: inline-flex; align-items: center; gap: 8px;">
                <span>DJI</span>
                <span style="opacity: 0.5;">|</span>
                <span style="font-size: 16px; font-weight: 700; color: #ffffff;">D1 STORE</span>
              </div>
              <div style="color: #999999; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 6px;">
                Authorised Retail Store Australia
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 36px;">
              <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #111827; text-align: center;">
                Verification code
              </h1>
              <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 24px; color: #4b5563; text-align: center;">
                Enter this 6-digit code on the DJI D1 Store sign-in page to access your customer account:
              </p>

              <!-- Code Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: #f3f4f6; border: 2px dashed #0070e0; border-radius: 12px; padding: 18px 36px; margin-bottom: 24px;">
                      <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #0070e0; font-family: 'Courier New', Courier, monospace;">
                        ${code}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0; font-size: 13px; line-height: 20px; color: #6b7280; text-align: center;">
                This code is valid for <strong>10 minutes</strong>. If you did not request this code, someone may have entered your email by mistake and you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; border-top: 1px solid #eeeeee; padding: 24px 36px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af;">
                &copy; ${new Date().getFullYear()} D1 Store Australia. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                Official DJI Authorised Retailer &bull; Fast Shipping Australia-Wide
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      // 1. HTTP Provider: Resend API (HTTPS Port 443 — NEVER blocked by Render Free Tier)
      const resendApiKey = process.env.RESEND_API_KEY?.replace(/^["']|["']$/g, "").trim();
      if (resendApiKey) {
        try {
          const resendFrom =
            process.env.RESEND_FROM?.replace(/^["']|["']$/g, "").trim() ||
            "DJI D1 Store <onboarding@resend.dev>";

          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: resendFrom,
              to: [toEmail],
              subject: `${code} is your DJI D1 Store verification code`,
              html: emailHtml,
            }),
          });

          const resData: any = await response.json();
          if (response.ok) {
            console.log(`[EmailService] Sent to ${toEmail} via Resend HTTPS API (port 443). Id: ${resData.id}`);
            return { success: true };
          }

          console.error("[EmailService] Resend API error response:", resData);
          return {
            success: false,
            error: resData?.message || "Resend email delivery failed",
          };
        } catch (resendErr: any) {
          console.error("[EmailService] Resend network error:", resendErr);
          return { success: false, error: resendErr?.message || "Resend connection error" };
        }
      }

      // 2. HTTP Provider: Brevo API (HTTPS Port 443 — NEVER blocked by Render Free Tier)
      const brevoApiKey = process.env.BREVO_API_KEY?.replace(/^["']|["']$/g, "").trim();
      if (brevoApiKey) {
        try {
          const senderEmail =
            process.env.EMAIL_USER?.replace(/^["']|["']$/g, "").trim() || "saidulislamshehabb@gmail.com";

          const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              "api-key": brevoApiKey,
              "Content-Type": "application/json",
              accept: "application/json",
            },
            body: JSON.stringify({
              sender: { name: "DJI D1 Store", email: senderEmail },
              to: [{ email: toEmail }],
              subject: `${code} is your DJI D1 Store verification code`,
              htmlContent: emailHtml,
            }),
          });

          const brevoData: any = await response.json();
          if (response.ok) {
            console.log(`[EmailService] Sent to ${toEmail} via Brevo HTTPS API (port 443). Id: ${brevoData.messageId}`);
            return { success: true };
          }

          console.error("[EmailService] Brevo API error response:", brevoData);
          return {
            success: false,
            error: brevoData?.message || "Brevo email delivery failed",
          };
        } catch (brevoErr: any) {
          console.error("[EmailService] Brevo network error:", brevoErr);
          return { success: false, error: brevoErr?.message || "Brevo connection error" };
        }
      }

      // 3. Fallback to standard SMTP (Gmail / Custom SMTP)
      const creds = this.cleanCredentials();
      if (!creds) {
        return {
          success: false,
          error: "Email delivery credentials missing. For Render Free tier, add a free RESEND_API_KEY to your Render environment variables (which uses HTTPS port 443), or set EMAIL_USER (with @) and EMAIL_PASS.",
        };
      }

      if (!creds.user.includes("@")) {
        return {
          success: false,
          error: `EMAIL_USER '${creds.user}' is missing the '@' sign. Please update EMAIL_USER to a valid email address in your hosting dashboard.`,
        };
      }

      const mailOptions = {
        from: `"DJI | D1 Store" <${creds.user}>`,
        to: toEmail,
        subject: `${code} is your DJI D1 Store verification code`,
        text: `Your DJI D1 Store verification code is: ${code}. It expires in 10 minutes.`,
        html: emailHtml,
      };

      const primaryPort = Number(process.env.SMTP_PORT) || 465;
      const primarySecure = process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE === "true" : primaryPort === 465;

      let sendError: any = null;

      // Attempt 1: Primary port (default: 465 SSL)
      try {
        const primaryTransporter = this.createTransporter(primaryPort, primarySecure);
        if (primaryTransporter) {
          const info = await primaryTransporter.sendMail(mailOptions);
          console.log(`[EmailService] Verification code sent to ${toEmail} via port ${primaryPort}. MessageId: ${info.messageId}`);
          return { success: true };
        }
      } catch (err: any) {
        sendError = err;
        console.warn(`[EmailService] Primary SMTP attempt (port ${primaryPort}) failed:`, err?.message || err);
      }

      // Attempt 2: Fallback port 587 (STARTTLS) if port 465 was blocked by cloud host firewall
      if (primaryPort === 465) {
        try {
          console.log(`[EmailService] Retrying mail delivery to ${toEmail} via fallback port 587 (STARTTLS)...`);
          const fallbackTransporter = this.createTransporter(587, false);
          if (fallbackTransporter) {
            const info = await fallbackTransporter.sendMail(mailOptions);
            console.log(`[EmailService] Verification code sent to ${toEmail} via fallback port 587. MessageId: ${info.messageId}`);
            return { success: true };
          }
        } catch (fallbackErr: any) {
          sendError = fallbackErr;
          console.error("[EmailService] Fallback SMTP attempt (port 587) failed:", fallbackErr?.message || fallbackErr);
        }
      }

      const errDetail = sendError?.message || "Failed to establish SMTP connection";
      const isTimeout = String(errDetail).toLowerCase().includes("timeout");
      const errorHelp = isTimeout
        ? "Render Free tier blocks outbound SMTP ports 465 & 587. To send emails on the free tier, add a free RESEND_API_KEY (from resend.com) or BREVO_API_KEY (from brevo.com) to your Render environment variables to send over HTTPS port 443."
        : "Please verify EMAIL_USER has a valid email (with @) and EMAIL_PASS has a valid Google App Password without quotes in your hosting dashboard.";

      return {
        success: false,
        error: `Email delivery failed (${errDetail}). ${errorHelp}`,
      };
    } catch (error: any) {
      console.error("[EmailService] Unexpected error sending email:", error);
      return { success: false, error: error?.message || "Failed to send email" };
    }
  }
}
