import nodemailer, { Transporter } from "nodemailer";

export class EmailService {
  private static transporter: Transporter | null = null;

  private static getTransporter(): Transporter | null {
    if (!this.transporter) {
      const user = process.env.EMAIL_USER?.trim();
      const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "").trim() : "";

      if (!user || !pass) {
        console.warn("[EmailService] EMAIL_USER or EMAIL_PASS environment variable is missing.");
        return null;
      }

      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE !== "false", // true for 465, false for other ports
        auth: {
          user,
          pass,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });
    }
    return this.transporter;
  }

  static async sendVerificationCode(toEmail: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
      const transporter = this.getTransporter();
      if (!transporter) {
        return { success: false, error: "SMTP email credentials (EMAIL_USER / EMAIL_PASS) are not configured on the server." };
      }

      const fromEmail = process.env.EMAIL_USER;

      const mailOptions = {
        from: `"DJI | D1 Store" <${fromEmail}>`,
        to: toEmail,
        subject: `${code} is your DJI D1 Store verification code`,
        text: `Your DJI D1 Store verification code is: ${code}. It expires in 10 minutes.`,
        html: `
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
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[EmailService] Verification code sent to ${toEmail}. MessageId: ${info.messageId}`);
      return { success: true };
    } catch (error: any) {
      console.error("[EmailService] Failed to send verification code email:", error);
      return { success: false, error: error?.message || "Failed to send email" };
    }
  }
}
