import fs from "fs";
import path from "path";
import {
  EMAIL_LOGO_BASE64,
  ICON_IG_BASE64,
  ICON_DISCORD_BASE64,
  ICON_X_BASE64,
  ICON_LINKEDIN_BASE64,
} from "./email-assets";

export interface EmailOptions {
  email: string;
  name?: string;
  isBrowserPreview?: boolean;
}

/**
 * Records captured email into a persistent local CSV list for marketing.
 * Safely handles serverless environments (e.g. Vercel) where root filesystem is read-only.
 */
function recordWaitlistContactLocally(email: string, name?: string) {
  try {
    const dir = process.env.VERCEL
      ? path.join("/tmp", "data")
      : path.join(process.cwd(), "data");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const csvPath = path.join(dir, "waitlist.csv");
    if (!fs.existsSync(csvPath)) {
      fs.writeFileSync(csvPath, "Email,Name,Timestamp\n", "utf8");
    }
    const timestamp = new Date().toISOString();
    const line = `"${email}","${name || "Student"}","${timestamp}"\n`;
    fs.appendFileSync(csvPath, line, "utf8");
  } catch (err) {
    // Non-fatal: Brevo contact list is the primary persistent storage
    console.warn("[Waitlist Local Backup Notice]", err);
  }
}

/**
 * Returns a polished, modern, responsive HTML email template.
 * - Single-column fluid layout (no rigid outer boxes or horizontal scrollbars)
 * - Perfectly centered on mobile & desktop
 * - Clean editorial typography (balanced weights, no generic AI-slop badges)
 * - Minimalist social icons
 * - Bottom hero with Deep Blue U-Tag Leaf Logo and refined gradient
 */
export function getWelcomeEmailHtml({
  name,
  isBrowserPreview = false,
}: EmailOptions): string {
  // Format recipient display name
  const displayName = name && name.trim() ? name.trim() : "there";

  // Use inline CIDs for live email delivery, or public paths for browser preview
  const logoSrc = isBrowserPreview
    ? "/logo-u-blue-email.png"
    : "cid:logo-u.png";
  const igSrc = isBrowserPreview
    ? "/social/instagram.png"
    : "cid:icon-ig.png";
  const discordSrc = isBrowserPreview
    ? "/social/discord.png"
    : "cid:icon-discord.png";
  const xSrc = isBrowserPreview
    ? "/social/x.png"
    : "cid:icon-x.png";
  const inSrc = isBrowserPreview
    ? "/social/linkedin.png"
    : "cid:icon-linkedin.png";

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Welcome to Unideals Early Access</title>
  <style type="text/css">
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #ffffff !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
    }
    img {
      border: 0;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    table {
      border-collapse: collapse !important;
    }
    @media only screen and (max-width: 520px) {
      .content-cell {
        padding: 32px 20px 24px 20px !important;
      }
      .email-title {
        font-size: 24px !important;
        line-height: 1.25 !important;
      }
      .body-p {
        font-size: 15px !important;
        line-height: 1.6 !important;
      }
      .bottom-hero-cell {
        padding: 36px 20px 28px 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff;">
  <!-- Centered Single-Column Container (No rigid outer card, zero horizontal scrolling) -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; width: 100%; margin: 0 auto;">
    <tr>
      <td align="center" style="padding: 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 480px; width: 100%; margin: 0 auto; text-align: left;">
          
          <!-- TOP MESSAGE SECTION -->
          <tr>
            <td class="content-cell" style="padding: 44px 24px 28px 24px;">
              <p style="margin: 0 0 10px 0; font-size: 15px; font-weight: 500; color: #64748b; letter-spacing: -0.01em;">
                Hi, ${displayName}
              </p>

              <h1 class="email-title" style="margin: 0 0 18px 0; font-size: 27px; font-weight: 700; color: #0f172a; line-height: 1.28; letter-spacing: -0.025em;">
                Welcome to Unideals Early Access
              </h1>

              <p style="margin: 0 0 16px 0; font-size: 15px; font-style: italic; font-weight: 500; color: #000000; line-height: 1.55; letter-spacing: -0.01em;">
                &ldquo;You have something to sell. Someone&rsquo;s looking for it.&rdquo;
              </p>

              <p class="body-p" style="margin: 0 0 16px 0; font-size: 15px; font-weight: 400; color: #475569; line-height: 1.65;">
                You&rsquo;re officially on the exclusive early access list. We are preparing to launch Unideals at your university so students can buy, sell, and trade textbooks, electronics, dorm essentials, and campus tickets directly with verified peers.
              </p>

              <p class="body-p" style="margin: 0 0 24px 0; font-size: 15px; font-weight: 400; color: #475569; line-height: 1.65;">
                We will notify you the moment your campus opens for student listings.
              </p>

              <!-- SIMPLE SHARE WITH FRIENDS -->
              <p style="margin: 0 0 28px 0; font-size: 14px; color: #64748b; line-height: 1.6;">
                Share with friends: <a href="https://www.unideals.in/" target="_blank" style="font-weight: 600; color: #3838EC; text-decoration: underline;">unideals.in</a> &nbsp;&middot;&nbsp; <a href="https://api.whatsapp.com/send?text=Hey!%20Join%20me%20on%20Unideals%20Early%20Access%20for%20our%20campus:%20https://www.unideals.in/" target="_blank" style="font-weight: 600; color: #3838EC; text-decoration: underline;">Share</a>
              </p>

              <!-- MINIMALIST SOCIAL ICONS ROW (Clean SVGs/PNGs, no tacky pills or emojis) -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 8px 0; width: 100%;">
                <tr>
                  <td style="border-top: 1px solid #f1f5f9; padding-top: 24px;">
                    <p style="margin: 0 0 14px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8;">
                      Stay Connected
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <!-- Instagram -->
                        <td style="padding-right: 12px;">
                          <a href="https://instagram.com/unideals" target="_blank" style="text-decoration: none; display: inline-block;">
                            <img src="${igSrc}" alt="Instagram" width="22" height="22" style="display: block; width: 22px; height: 22px; border: 0;" />
                          </a>
                        </td>
                        <!-- Discord -->
                        <td style="padding-right: 12px;">
                          <a href="https://discord.gg/unideals" target="_blank" style="text-decoration: none; display: inline-block;">
                            <img src="${discordSrc}" alt="Discord" width="22" height="22" style="display: block; width: 22px; height: 22px; border: 0;" />
                          </a>
                        </td>
                        <!-- X (Twitter) -->
                        <td style="padding-right: 12px;">
                          <a href="https://x.com/unideals" target="_blank" style="text-decoration: none; display: inline-block;">
                            <img src="${xSrc}" alt="X" width="22" height="22" style="display: block; width: 22px; height: 22px; border: 0;" />
                          </a>
                        </td>
                        <!-- LinkedIn -->
                        <td style="padding-right: 12px;">
                          <a href="https://linkedin.com/company/unideals" target="_blank" style="text-decoration: none; display: inline-block;">
                            <img src="${inSrc}" alt="LinkedIn" width="22" height="22" style="display: block; width: 22px; height: 22px; border: 0;" />
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- BOTTOM HERO SECTION (Deep Blue U-Tag Leaf Logo + Refined Gradient Fade) -->
          <tr>
            <td class="bottom-hero-cell" align="center" style="background: linear-gradient(180deg, #ffffff 0%, #f4f4fe 30%, #3838EC 90%, #2929c4 100%); border-radius: 24px; padding: 40px 24px 30px 24px; text-align: center;">
              <!-- Deep Blue U-Tag Leaf Logo (Retina, 86px wide, sharp) -->
              <img
                src="${logoSrc}"
                alt="Unideals Logo"
                width="86"
                height="126"
                style="display: block; margin: 0 auto; width: 86px; height: auto; border: 0; filter: drop-shadow(0 14px 22px rgba(16, 7, 43, 0.22));"
              />

              <p style="margin: 18px 0 0 0; font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #ffffff;">
                Team unideals
              </p>

              <p style="margin: 6px 0 0 0; font-size: 11px; font-weight: 500; color: rgba(255, 255, 255, 0.75); letter-spacing: -0.01em;">
                Campus Marketplace &middot; No spam ever
              </p>
            </td>
          </tr>

          <!-- Footer spacing -->
          <tr>
            <td style="height: 32px; font-size: 32px; line-height: 32px;">&nbsp;</td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Brevo API integration helper
 */
export async function addContactAndSendWelcome({
  email,
  name,
}: EmailOptions): Promise<{ success: boolean; message: string; simulated?: boolean }> {
  // 1. Immediately store the contact locally in data/waitlist.csv for marketing export
  recordWaitlistContactLocally(email, name);

  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID
    ? parseInt(process.env.BREVO_LIST_ID, 10)
    : 5;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "anuraglife2020@gmail.com";
  const senderName = process.env.BREVO_SENDER_NAME || "Unideals";

  // If API key is not yet set, simulate success gracefully
  if (!apiKey || apiKey.startsWith("YOUR_")) {
    console.log(
      `[Brevo Mock] Stored contact ${email} locally. Set BREVO_API_KEY in .env.local for live delivery.`
    );
    return {
      success: true,
      message: "You're on the list! We've saved your spot.",
      simulated: true,
    };
  }

  // 2. Add / Update Contact in Brevo Contact List
  try {
    const contactPayload: Record<string, unknown> = {
      email,
      attributes: {
        FIRSTNAME: name || "Student",
      },
      updateEnabled: true,
    };

    if (listId && !isNaN(listId)) {
      contactPayload.listIds = [listId];
    }

    const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(contactPayload),
    });

    if (!contactRes.ok && contactRes.status !== 400 && contactRes.status !== 403) {
      const errData = await contactRes.json();
      console.warn("[Brevo] Contact list notice:", errData);
    }
  } catch (err) {
    console.warn("[Brevo] Contact list add skipped, proceeding to send email:", err);
  }

  // 3. Prepare Inline Base64 Attachments so ALL images load in Gmail without breaking
  // Uses pre-bundled base64 assets so it functions flawlessly across all serverless deployments
  const attachments: Array<{ name: string; content: string }> = [
    {
      name: "logo-u.png",
      content: EMAIL_LOGO_BASE64,
    },
    {
      name: "icon-ig.png",
      content: ICON_IG_BASE64,
    },
    {
      name: "icon-discord.png",
      content: ICON_DISCORD_BASE64,
    },
    {
      name: "icon-x.png",
      content: ICON_X_BASE64,
    },
    {
      name: "icon-linkedin.png",
      content: ICON_LINKEDIN_BASE64,
    },
  ];

  // 4. Generate Polished HTML Content (using CID references)
  const htmlContent = getWelcomeEmailHtml({ email, name, isBrowserPreview: false });

  // 5. Send Classy Welcome Email via Brevo Transactional SMTP API
  const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [
        {
          email,
          name: name || "Student",
        },
      ],
      subject: "Welcome to Unideals Early Access! 🚀",
      htmlContent,
      attachment: attachments,
    }),
  });

  if (!emailRes.ok) {
    const errData = await emailRes.json();
    throw new Error(errData.message || "Failed to send email through Brevo");
  }

  return {
    success: true,
    message: "You're on the list! We've sent a confirmation email.",
  };
}
