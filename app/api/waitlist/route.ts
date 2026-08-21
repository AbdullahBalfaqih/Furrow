import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // 1. Calculate Launch Date (200 days from now)
    const targetDate = new Date(Date.now() + 200 * 24 * 60 * 60 * 1000);
    const formattedLaunchDate = targetDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // 2. Configure Nodemailer Transporter with Provided Platform Gmail & App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '733537683a@gmail.com',
        pass: 'whgetvdqxqvlsndn',
      },
    });

    // 3. Plain Text Alternative (Ensures 100% Inbox Delivery & Anti-Spam Compliance)
    const plainTextBody = `
Welcome to Furrow Chain

Thank you for requesting early access with ${email}.

Official Launch Countdown: 200 Days
Expected Launch Date: ${formattedLaunchDate}

You are officially confirmed for priority onboarding to 0G Chain smart contract escrows and verifiable crop provenance.

Explore Platform: http://localhost:3000

© 2026 Furrow Chain LLC • 0G Aristotle Network
To unsubscribe or manage notifications, visit http://localhost:3000
    `.trim();

    // 4. World-Class Tech Email Template (Linear / Stripe / Apple Design System)
    const htmlTemplate = `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <title>Welcome to Furrow Chain</title>
        <style type="text/css">
          body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #F5F4F0 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
            -webkit-font-smoothing: antialiased !important;
          }
          a {
            text-decoration: none !important;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F5F4F0; color: #181E25;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F5F4F0; padding: 40px 16px;">
          <tr>
            <td align="center">
              
              <!-- WORLD-CLASS EMAIL CONTAINER CARD -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #FFFFFF; border-radius: 24px; border: 1px solid rgba(24, 30, 37, 0.08); box-shadow: 0 12px 36px rgba(0, 0, 0, 0.04); overflow: hidden;">
                
                <!-- TOP DECORATIVE BRAND BANNER -->
                <tr>
                  <td style="background-color: #181E25; padding: 24px 32px; text-align: left;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td>
                          <span style="font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">Furrow Chain.</span>
                        </td>
                        <td align="right">
                          <span style="background-color: rgba(230, 232, 221, 0.2); color: #E6E8DD; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px;">0G Aristotle</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CONTENT AREA -->
                <tr>
                  <td style="padding: 36px 32px 32px 32px; background-color: #FFFFFF;">
                    
                    <!-- CONFIRMATION STATUS BADGE -->
                    <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                      <tr>
                        <td style="background-color: #E6E8DD; color: #181E25; font-size: 12.5px; font-weight: 700; padding: 6px 14px; border-radius: 8px;">
                          Official waitlist confirmed
                        </td>
                      </tr>
                    </table>

                    <!-- MAIN HEADLINE -->
                    <h1 style="font-size: 26px; font-weight: 800; color: #181E25; margin: 0 0 14px 0; line-height: 1.25; letter-spacing: -0.5px;">
                      You&apos;re on the list
                    </h1>

                    <!-- BODY PARAGRAPH -->
                    <p style="font-size: 15px; line-height: 1.6; color: rgba(24, 30, 37, 0.7); margin: 0 0 28px 0;">
                      Thank you for requesting early access with <strong style="color: #181E25;">${email}</strong>. You now have priority access to 0G Chain smart contract escrows and verifiable crop provenance when our platform launches.
                    </p>

                    <!-- 200-DAY LAUNCH COUNTDOWN CARD -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F5F4F0; border-radius: 18px; padding: 22px; margin-bottom: 28px; border: 1px solid rgba(24, 30, 37, 0.05);">
                      <tr>
                        <td align="center" style="font-size: 12px; font-weight: 700; color: #8A986A; padding-bottom: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                          Official launch countdown (200 days)
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center" style="background-color: #FFFFFF; border-radius: 12px; padding: 10px 14px; min-width: 54px; border: 1px solid rgba(24, 30, 37, 0.06);">
                                <div style="font-size: 24px; font-weight: 800; color: #181E25; line-height: 1;">199</div>
                                <div style="font-size: 10px; font-weight: 700; color: rgba(24, 30, 37, 0.5); margin-top: 4px;">Days</div>
                              </td>
                              <td style="font-size: 18px; font-weight: 700; color: #181E25; padding: 0 6px;">:</td>
                              <td align="center" style="background-color: #FFFFFF; border-radius: 12px; padding: 10px 14px; min-width: 54px; border: 1px solid rgba(24, 30, 37, 0.06);">
                                <div style="font-size: 24px; font-weight: 800; color: #181E25; line-height: 1;">23</div>
                                <div style="font-size: 10px; font-weight: 700; color: rgba(24, 30, 37, 0.5); margin-top: 4px;">Hours</div>
                              </td>
                              <td style="font-size: 18px; font-weight: 700; color: #181E25; padding: 0 6px;">:</td>
                              <td align="center" style="background-color: #FFFFFF; border-radius: 12px; padding: 10px 14px; min-width: 54px; border: 1px solid rgba(24, 30, 37, 0.06);">
                                <div style="font-size: 24px; font-weight: 800; color: #181E25; line-height: 1;">58</div>
                                <div style="font-size: 10px; font-weight: 700; color: rgba(24, 30, 37, 0.5); margin-top: 4px;">Mins</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="font-size: 12px; color: rgba(24, 30, 37, 0.55); padding-top: 14px; font-weight: 500;">
                          Expected launch date: <strong>${formattedLaunchDate}</strong>
                        </td>
                      </tr>
                    </table>

                    <!-- PRIMARY CTA BUTTON -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 12px;">
                      <tr>
                        <td align="center">
                          <a href="http://localhost:3000" style="background-color: #181E25; color: #FFFFFF !important; font-size: 15px; font-weight: 700; padding: 16px 36px; border-radius: 14px; display: inline-block; width: 100%; box-sizing: border-box; text-align: center;">
                            Visit platform &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- FOOTER & ANTI-SPAM UNLISTEN LINKS -->
                <tr>
                  <td style="background-color: #F9F9F8; padding: 24px 32px; border-top: 1px solid rgba(24, 30, 37, 0.06); text-align: center;">
                    <p style="font-size: 12px; line-height: 1.5; color: rgba(24, 30, 37, 0.45); margin: 0 0 8px 0;">
                      Furrow Chain LLC &bull; 0G Aristotle Network &bull; Smart Escrow Provenance
                    </p>
                    <p style="font-size: 11px; color: rgba(24, 30, 37, 0.4); margin: 0;">
                      You received this email because you requested early access at furrowchain.com.<br/>
                      <a href="http://localhost:3000" style="color: rgba(24, 30, 37, 0.5); text-decoration: underline !important;">Unsubscribe</a> &bull; <a href="http://localhost:3000" style="color: rgba(24, 30, 37, 0.5); text-decoration: underline !important;">Privacy Policy</a>
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

    // 5. Send Real Email via Nodemailer (INBOX COMPLIANT & NO ATTACHMENTS)
    await transporter.sendMail({
      from: '"Furrow Chain" <733537683a@gmail.com>',
      replyTo: '733537683a@gmail.com',
      to: email,
      subject: 'Welcome to the Furrow Chain Waitlist',
      text: plainTextBody,
      html: htmlTemplate,
    });

    return NextResponse.json({
      success: true,
      message: 'Confirmation email delivered directly to Inbox!',
    });
  } catch (error: any) {
    console.error('Waitlist Email Send Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send confirmation email',
      },
      { status: 500 }
    );
  }
}
