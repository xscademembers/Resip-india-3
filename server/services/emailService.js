const nodemailer = require('nodemailer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

class EmailService {
  constructor() {
    this.transporter = null;
    this.from = process.env.EMAIL_FROM || 'ReSip India <noreply@resipindia.com>';
    this.clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    // When set, email is delivered over Brevo's HTTPS API (port 443) instead of
    // SMTP. This is required on hosts like Render that block outbound SMTP ports
    // (25/465/587), which otherwise cause "Connection timeout" errors.
    this.brevoApiKey = process.env.BREVO_API_KEY;
  }

  /**
   * Initialize the SMTP transporter (lazy init).
   * Only used as a fallback for local dev when BREVO_API_KEY is not set.
   */
  getTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        // Fail fast instead of hanging when the mail host is slow/unreachable.
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });
    }
    return this.transporter;
  }

  /**
   * Parse an "EMAIL_FROM" string like "ReSip India <hello@resipindia.com>"
   * into the { name, email } shape Brevo expects.
   */
  parseSender() {
    const raw = this.from || 'ReSip India <noreply@resipindia.com>';
    const match = raw.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
    if (match) {
      return { name: match[1] || 'ReSip India', email: match[2].trim() };
    }
    return { name: 'ReSip India', email: raw.trim() };
  }

  /**
   * Deliver a single email. Uses the Brevo HTTP API when BREVO_API_KEY is set
   * (works on Render/hosts that block SMTP ports); otherwise falls back to SMTP.
   * `replyTo` (optional) lets the recipient reply directly to a third party
   * (e.g. the customer who filled the contact form).
   */
  async deliver({ to, subject, html, replyTo }) {
    if (this.brevoApiKey) {
      const payload = {
        sender: this.parseSender(),
        to: [{ email: to }],
        subject,
        htmlContent: html,
      };
      if (replyTo) {
        payload.replyTo = { email: replyTo };
      }
      try {
        const response = await axios.post(
          'https://api.brevo.com/v3/smtp/email',
          payload,
          {
            headers: {
              'api-key': this.brevoApiKey,
              'Content-Type': 'application/json',
              accept: 'application/json',
            },
            timeout: 15000,
          }
        );
        return { messageId: response.data?.messageId || 'brevo' };
      } catch (err) {
        // Surface Brevo's actual error (e.g. invalid key, unverified sender)
        // instead of a generic "status code 401".
        const brevo = err.response?.data;
        const keyPrefix = (this.brevoApiKey || '').slice(0, 9);
        const detail = brevo
          ? `${brevo.code || ''} ${brevo.message || ''}`.trim()
          : err.message;
        console.error(
          `❌ Brevo API error (${err.response?.status || '?'}): ${detail} ` +
          `[from=${this.parseSender().email}, keyStartsWith=${keyPrefix}]`
        );
        throw new Error(`Brevo: ${detail}`);
      }
    }

    const mailOptions = { from: this.from, to, subject, html };
    if (replyTo) mailOptions.replyTo = replyTo;
    return this.getTransporter().sendMail(mailOptions);
  }

  /**
   * Load and process an email template.
   */
  loadTemplate(templateName, variables = {}) {
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
    
    // Fallback to inline template if file doesn't exist
    if (!fs.existsSync(templatePath)) {
      return this.generateTemplate(templateName, variables);
    }

    let html = fs.readFileSync(templatePath, 'utf8');
    
    // Replace template variables
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, value || '');
    }
    
    return html;
  }

  /**
   * Generate inline template if template file doesn't exist.
   */
  generateTemplate(templateName, vars) {
    const brandBlue = '#0047ab';
    const brandGold = '#d1aa05';
    const logo = 'https://static.wixstatic.com/media/9356bd_a4f67380f1ee44fc85bbaddce42a4556~mv2.png';

    const header = `
      <div style="background-color:${brandBlue};padding:30px;text-align:center;">
        <img src="${logo}" alt="ReSip India" style="height:60px;width:auto;" />
      </div>
    `;

    const footer = `
      <div style="background-color:#f8f8f8;padding:20px;text-align:center;font-size:12px;color:#999;">
        <p>&copy; ${new Date().getFullYear()} ReSip India. All rights reserved.</p>
        <p>Upcycling With A Cause</p>
        <p style="margin-top:10px;">
          <a href="${this.clientUrl}" style="color:${brandBlue};text-decoration:none;">Visit our website</a>
        </p>
      </div>
    `;

    const wrapper = (content) => `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f4f4;">
        <div style="max-width:600px;margin:0 auto;background-color:#ffffff;">
          ${header}
          <div style="padding:30px 40px;">${content}</div>
          ${footer}
        </div>
      </body>
      </html>
    `;

    const templates = {
      welcome: wrapper(`
        <h1 style="color:${brandBlue};font-size:24px;">Welcome to ReSip India!</h1>
        <p style="color:#333;line-height:1.6;">Hi ${vars.name || 'there'},</p>
        <p style="color:#555;line-height:1.6;">Thank you for joining the ReSip family! We're thrilled to have you on board.</p>
        <p style="color:#555;line-height:1.6;">At ReSip India, we transform discarded bottles into stunning, handcrafted glassware sustainable luxury for your home.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${this.clientUrl}/shop" style="display:inline-block;padding:14px 32px;background-color:${brandBlue};color:#fff;text-decoration:none;border-radius:30px;font-weight:bold;">Explore Our Collection</a>
        </div>
      `),

      verification: wrapper(`
        <h1 style="color:${brandBlue};font-size:24px;">Verify Your Email</h1>
        <p style="color:#333;line-height:1.6;">Hi ${vars.name || 'there'},</p>
        <p style="color:#555;line-height:1.6;">Please verify your email address by clicking the button below:</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${vars.verificationUrl}" style="display:inline-block;padding:14px 32px;background-color:${brandBlue};color:#fff;text-decoration:none;border-radius:30px;font-weight:bold;">Verify Email</a>
        </div>
        <p style="color:#999;font-size:12px;">This link expires in 24 hours. If you didn't create an account, please ignore this email.</p>
      `),

      forgotPassword: wrapper(`
        <h1 style="color:${brandBlue};font-size:24px;">Reset Your Password</h1>
        <p style="color:#333;line-height:1.6;">Hi ${vars.name || 'there'},</p>
        <p style="color:#555;line-height:1.6;">We received a request to reset your password. Click below to set a new one:</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${vars.resetUrl}" style="display:inline-block;padding:14px 32px;background-color:${brandBlue};color:#fff;text-decoration:none;border-radius:30px;font-weight:bold;">Reset Password</a>
        </div>
        <p style="color:#999;font-size:12px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
      `),

      passwordReset: wrapper(`
        <h1 style="color:${brandBlue};font-size:24px;">Password Changed Successfully</h1>
        <p style="color:#333;line-height:1.6;">Hi ${vars.name || 'there'},</p>
        <p style="color:#555;line-height:1.6;">Your password has been successfully changed. If you didn't make this change, please contact us immediately.</p>
      `),

      orderConfirmation: wrapper(`
        <h1 style="color:${brandBlue};font-size:24px;">Order Confirmed! 🎉</h1>
        <p style="color:#333;line-height:1.6;">Hi ${vars.name || 'there'},</p>
        <p style="color:#555;line-height:1.6;">Thank you for your order! Here are your order details:</p>
        <div style="background-color:#f8f9fa;border-radius:12px;padding:20px;margin:20px 0;">
          <p style="margin:0;"><strong>Order ID:</strong> ${vars.orderId || ''}</p>
          <p style="margin:8px 0 0;"><strong>Total:</strong> ₹${vars.total || '0'}</p>
          <p style="margin:8px 0 0;"><strong>Payment:</strong> ${vars.paymentMethod || 'Online'}</p>
        </div>
        ${vars.itemsHtml || ''}
        <div style="text-align:center;margin:30px 0;">
          <a href="${this.clientUrl}/orders/${vars.orderId || ''}" style="display:inline-block;padding:14px 32px;background-color:${brandBlue};color:#fff;text-decoration:none;border-radius:30px;font-weight:bold;">View Order</a>
        </div>
      `),

      paymentSuccess: wrapper(`
        <h1 style="color:${brandBlue};font-size:24px;">Payment Successful ✅</h1>
        <p style="color:#333;line-height:1.6;">Hi ${vars.name || 'there'},</p>
        <p style="color:#555;line-height:1.6;">Your payment of <strong>₹${vars.amount || '0'}</strong> for order <strong>${vars.orderId || ''}</strong> has been received successfully.</p>
        <p style="color:#555;line-height:1.6;">Transaction ID: ${vars.transactionId || ''}</p>
      `),

      paymentFailed: wrapper(`
        <h1 style="color:#dc3545;font-size:24px;">Payment Failed ❌</h1>
        <p style="color:#333;line-height:1.6;">Hi ${vars.name || 'there'},</p>
        <p style="color:#555;line-height:1.6;">Unfortunately, your payment for order <strong>${vars.orderId || ''}</strong> could not be processed.</p>
        <p style="color:#555;line-height:1.6;">Please try again or use a different payment method.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${this.clientUrl}/checkout" style="display:inline-block;padding:14px 32px;background-color:${brandBlue};color:#fff;text-decoration:none;border-radius:30px;font-weight:bold;">Retry Payment</a>
        </div>
      `),

      orderStatusUpdate: wrapper(`
        <h1 style="color:${brandBlue};font-size:24px;">Order Update: ${vars.status || ''}</h1>
        <p style="color:#333;line-height:1.6;">Hi ${vars.name || 'there'},</p>
        <p style="color:#555;line-height:1.6;">Your order <strong>${vars.orderId || ''}</strong> has been updated:</p>
        <div style="background-color:#f8f9fa;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
          <p style="margin:0;font-size:20px;font-weight:bold;color:${brandBlue};">${vars.status || ''}</p>
          ${vars.trackingNumber ? `<p style="margin:8px 0 0;">Tracking: ${vars.trackingNumber}</p>` : ''}
        </div>
        <div style="text-align:center;margin:30px 0;">
          <a href="${this.clientUrl}/orders/${vars.orderId || ''}" style="display:inline-block;padding:14px 32px;background-color:${brandBlue};color:#fff;text-decoration:none;border-radius:30px;font-weight:bold;">Track Order</a>
        </div>
      `),

      orderCancelled: wrapper(`
        <h1 style="color:#dc3545;font-size:24px;">Order Cancelled</h1>
        <p style="color:#333;line-height:1.6;">Hi ${vars.name || 'there'},</p>
        <p style="color:#555;line-height:1.6;">Your order <strong>${vars.orderId || ''}</strong> has been cancelled.</p>
        <p style="color:#555;line-height:1.6;">If a payment was made, it will be refunded within 5-7 business days.</p>
      `),

      refundCompleted: wrapper(`
        <h1 style="color:${brandBlue};font-size:24px;">Refund Processed ✅</h1>
        <p style="color:#333;line-height:1.6;">Hi ${vars.name || 'there'},</p>
        <p style="color:#555;line-height:1.6;">A refund of <strong>₹${vars.refundAmount || '0'}</strong> for order <strong>${vars.orderId || ''}</strong> has been processed.</p>
        <p style="color:#555;line-height:1.6;">Refund ID: ${vars.refundId || ''}</p>
        <p style="color:#555;line-height:1.6;">Please allow 5-7 business days for the amount to reflect in your account.</p>
      `),
    };

    return templates[templateName] || wrapper(`<p>${vars.message || ''}</p>`);
  }

  /**
   * Send an email.
   */
  async send({ to, subject, template, variables = {} }) {
    try {
      const html = this.loadTemplate(template, variables);

      const info = await this.deliver({ to, subject, html });
      console.log(`📧 Email sent: ${subject} → ${to} (${info.messageId})`);
      return info;
    } catch (error) {
      console.error(`❌ Email failed: ${subject} → ${to}`, error.message);
      // Don't throw email failures shouldn't break the flow
      return null;
    }
  }

  // ---------- Convenience methods ----------

  async sendWelcomeEmail(user) {
    return this.send({
      to: user.email,
      subject: 'Welcome to ReSip India! 🌿',
      template: 'welcome',
      variables: { name: user.name },
    });
  }

  async sendVerificationEmail(user, token) {
    const verificationUrl = `${this.clientUrl}/verify-email/${token}`;
    return this.send({
      to: user.email,
      subject: 'Verify Your Email ReSip India',
      template: 'verification',
      variables: { name: user.name, verificationUrl },
    });
  }

  async sendForgotPasswordEmail(user, token) {
    const resetUrl = `${this.clientUrl}/reset-password/${token}`;
    return this.send({
      to: user.email,
      subject: 'Reset Your Password ReSip India',
      template: 'forgotPassword',
      variables: { name: user.name, resetUrl },
    });
  }

  async sendPasswordResetConfirmation(user) {
    return this.send({
      to: user.email,
      subject: 'Password Changed ReSip India',
      template: 'passwordReset',
      variables: { name: user.name },
    });
  }

  async sendOrderConfirmation(order, user) {
    const itemsHtml = order.items
      .map(
        (item) => `
          <div style="display:flex;align-items:center;padding:10px 0;border-bottom:1px solid #eee;">
            <div style="flex:1;">
              <p style="margin:0;font-weight:bold;">${item.name}</p>
              <p style="margin:4px 0 0;color:#999;font-size:13px;">Qty: ${item.quantity} × ₹${item.price}</p>
            </div>
            <p style="margin:0;font-weight:bold;">₹${item.subtotal}</p>
          </div>
        `
      )
      .join('');

    return this.send({
      to: user.email,
      subject: `Order Confirmed: ${order.orderId} ReSip India`,
      template: 'orderConfirmation',
      variables: {
        name: user.name,
        orderId: order.orderId,
        total: order.totalAmount?.toLocaleString('en-IN'),
        paymentMethod: order.paymentMethod,
        itemsHtml,
      },
    });
  }

  async sendPaymentSuccess(order, payment, user) {
    return this.send({
      to: user.email,
      subject: `Payment Received: ${order.orderId} ReSip India`,
      template: 'paymentSuccess',
      variables: {
        name: user.name,
        orderId: order.orderId,
        amount: payment.amount?.toLocaleString('en-IN'),
        transactionId: payment.transactionId,
      },
    });
  }

  async sendPaymentFailed(order, user) {
    return this.send({
      to: user.email,
      subject: `Payment Failed: ${order.orderId} ReSip India`,
      template: 'paymentFailed',
      variables: {
        name: user.name,
        orderId: order.orderId,
      },
    });
  }

  async sendOrderStatusUpdate(order, user) {
    return this.send({
      to: user.email,
      subject: `Order ${order.orderStatus}: ${order.orderId} ReSip India`,
      template: 'orderStatusUpdate',
      variables: {
        name: user.name,
        orderId: order.orderId,
        status: order.orderStatus,
        trackingNumber: order.trackingNumber || '',
      },
    });
  }

  async sendOrderCancelled(order, user) {
    return this.send({
      to: user.email,
      subject: `Order Cancelled: ${order.orderId} ReSip India`,
      template: 'orderCancelled',
      variables: {
        name: user.name,
        orderId: order.orderId,
      },
    });
  }

  async sendRefundCompleted(order, refundAmount, refundId, user) {
    return this.send({
      to: user.email,
      subject: `Refund Processed: ${order.orderId} ReSip India`,
      template: 'refundCompleted',
      variables: {
        name: user.name,
        orderId: order.orderId,
        refundAmount: refundAmount?.toLocaleString('en-IN'),
        refundId,
      },
    });
  }

  /**
   * Comprehensive customer order confirmation email.
   * Sent only after Cashfree payment is confirmed SUCCESS.
   */
  async sendCustomerOrderConfirmation(order, payment, user) {
    const brandBlue = '#0047ab';
    const brandGold = '#d1aa05';
    const logo = 'https://static.wixstatic.com/media/9356bd_a4f67380f1ee44fc85bbaddce42a4556~mv2.png';
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    const orderUrl = order.isGuest && order.accessToken
      ? `${this.clientUrl}/order/confirmation?orderId=${encodeURIComponent(order.orderId)}&token=${encodeURIComponent(order.accessToken)}`
      : `${this.clientUrl}/account/orders/${order.orderId}`;
    const isCod = order.paymentMethod === 'cod';
    const paymentMethodLabel = isCod ? 'Cash on Delivery' : 'Online Payment';
    const paymentStatusHtml = isCod
      ? '<span style="color:#f57f17;">💵 Pay on Delivery</span>'
      : '✅ Paid';

    // Build product rows
    const productRows = order.items.map((item) => `
      <tr>
        <td style="padding:12px 10px;border-bottom:1px solid #eee;font-size:14px;color:#333;">
          ${item.name}
          ${item.setSize ? `<br><span style="color:#999;font-size:12px;">Set of ${item.setSize}</span>` : ''}
          ${item.fragrance ? `<br><span style="color:#999;font-size:12px;">Fragrance: ${item.fragrance}</span>` : ''}
        </td>
        <td style="padding:12px 10px;border-bottom:1px solid #eee;font-size:14px;color:#333;text-align:center;">${item.quantity}</td>
        <td style="padding:12px 10px;border-bottom:1px solid #eee;font-size:14px;color:#333;text-align:right;">₹${item.price?.toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    // Build shipping address string
    const addr = order.shippingAddress || {};
    const addressLines = [
      addr.fullName,
      addr.addressLine1,
      addr.addressLine2,
      [addr.city, addr.state, addr.pincode].filter(Boolean).join(', '),
      addr.country,
      addr.phone ? `Phone: ${addr.phone}` : '',
    ].filter(Boolean).join('<br>');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Order Confirmation</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f4f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:20px 10px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background-color:${brandBlue};padding:30px;text-align:center;">
              <img src="${logo}" alt="ReSip India" style="height:50px;width:auto;" />
            </td>
          </tr>

          <!-- Thank You Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,${brandBlue} 0%,#003380 100%);padding:30px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:bold;">Thank You for Your Order! 🎉</h1>
              <p style="margin:10px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Your order has been confirmed and is being processed.</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:30px 40px 10px;">
              <p style="margin:0;color:#333;font-size:16px;line-height:1.6;">Hi <strong>${user.name || 'there'}</strong>,</p>
              <p style="margin:8px 0 0;color:#555;font-size:14px;line-height:1.6;">Thank you for shopping with ReSip India! We're thrilled to have you as part of our mission to upcycle with a cause. Here are your order details:</p>
            </td>
          </tr>

          <!-- Order Info Card -->
          <tr>
            <td style="padding:10px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;border-radius:10px;border:1px solid #e9ecef;">
                <tr>
                  <td style="padding:20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#888;">Order ID</td>
                        <td style="padding:4px 0;font-size:14px;color:#333;font-weight:bold;text-align:right;">${order.orderId}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#888;">Order Date</td>
                        <td style="padding:4px 0;font-size:14px;color:#333;text-align:right;">${orderDate}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#888;">Customer</td>
                        <td style="padding:4px 0;font-size:14px;color:#333;text-align:right;">${user.name || ''}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#888;">Email</td>
                        <td style="padding:4px 0;font-size:14px;color:#333;text-align:right;">${user.email || ''}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#888;">Payment Method</td>
                        <td style="padding:4px 0;font-size:14px;color:#333;text-align:right;">${paymentMethodLabel}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#888;">Payment Status</td>
                        <td style="padding:4px 0;font-size:14px;color:#27ae60;font-weight:bold;text-align:right;">${paymentStatusHtml}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding:15px 40px 5px;">
              <h3 style="margin:0;color:${brandBlue};font-size:15px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">Shipping Address</h3>
            </td>
          </tr>
          <tr>
            <td style="padding:5px 40px 15px;">
              <div style="background-color:#f8f9fa;border-radius:8px;padding:15px;font-size:14px;color:#333;line-height:1.7;border-left:3px solid ${brandBlue};">
                ${addressLines}
              </div>
            </td>
          </tr>

          <!-- Products Table -->
          <tr>
            <td style="padding:15px 40px 5px;">
              <h3 style="margin:0;color:${brandBlue};font-size:15px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">Items Ordered</h3>
            </td>
          </tr>
          <tr>
            <td style="padding:5px 40px 15px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;overflow:hidden;">
                <tr style="background-color:${brandBlue};">
                  <th style="padding:10px;font-size:13px;color:#fff;text-align:left;font-weight:600;">Product</th>
                  <th style="padding:10px;font-size:13px;color:#fff;text-align:center;font-weight:600;">Qty</th>
                  <th style="padding:10px;font-size:13px;color:#fff;text-align:right;font-weight:600;">Price</th>
                </tr>
                ${productRows}
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding:10px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;border-radius:8px;overflow:hidden;">
                <tr>
                  <td style="padding:10px 15px;font-size:14px;color:#555;">Subtotal</td>
                  <td style="padding:10px 15px;font-size:14px;color:#333;text-align:right;">₹${order.subtotal?.toLocaleString('en-IN')}</td>
                </tr>
                ${order.couponDiscount > 0 ? `
                <tr>
                  <td style="padding:6px 15px;font-size:14px;color:#27ae60;">Discount${order.couponCode ? ` (${order.couponCode})` : ''}</td>
                  <td style="padding:6px 15px;font-size:14px;color:#27ae60;text-align:right;">−₹${order.couponDiscount?.toLocaleString('en-IN')}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding:6px 15px;font-size:14px;color:#555;">Shipping</td>
                  <td style="padding:6px 15px;font-size:14px;color:#333;text-align:right;">${order.shippingCharge === 0 ? '<span style="color:#27ae60;">Free</span>' : '₹' + order.shippingCharge?.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding:6px 15px;font-size:14px;color:#555;">Tax (GST ${order.taxPercent || 18}%)</td>
                  <td style="padding:6px 15px;font-size:14px;color:#333;text-align:right;">₹${order.taxAmount?.toLocaleString('en-IN')}</td>
                </tr>
                ${order.codCharge > 0 ? `
                <tr>
                  <td style="padding:6px 15px;font-size:14px;color:#555;">COD Charges</td>
                  <td style="padding:6px 15px;font-size:14px;color:#333;text-align:right;">₹${order.codCharge?.toLocaleString('en-IN')}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding:12px 15px;font-size:18px;font-weight:bold;color:${brandBlue};border-top:2px solid ${brandBlue};">Order Total</td>
                  <td style="padding:12px 15px;font-size:18px;font-weight:bold;color:${brandBlue};text-align:right;border-top:2px solid ${brandBlue};">₹${order.totalAmount?.toLocaleString('en-IN')}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Estimated Delivery -->
          <tr>
            <td style="padding:15px 40px;">
              <div style="background-color:#fff8e1;border-radius:8px;padding:15px;text-align:center;border:1px solid #ffe082;">
                <p style="margin:0;font-size:14px;color:#f57f17;font-weight:bold;">📦 Estimated Delivery: 5–7 Business Days</p>
              </div>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:20px 40px;text-align:center;">
              <a href="${orderUrl}" style="display:inline-block;padding:14px 40px;background-color:${brandBlue};color:#ffffff;text-decoration:none;border-radius:30px;font-weight:bold;font-size:15px;">View My Order</a>
            </td>
          </tr>

          <!-- Contact Info -->
          <tr>
            <td style="padding:10px 40px 20px;">
              <p style="margin:0;font-size:13px;color:#888;text-align:center;line-height:1.6;">
                Questions about your order? Contact us at
                <a href="mailto:hello@resipindia.com" style="color:${brandBlue};text-decoration:none;font-weight:bold;">hello@resipindia.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8f8f8;padding:25px 40px;text-align:center;border-top:1px solid #eee;">
              <p style="margin:0;font-size:12px;color:#999;">© ${new Date().getFullYear()} ReSip India. All rights reserved.</p>
              <p style="margin:4px 0 0;font-size:12px;color:#aaa;">Upcycling With A Cause</p>
              <p style="margin:10px 0 0;">
                <a href="${this.clientUrl}" style="color:${brandBlue};text-decoration:none;font-size:13px;font-weight:bold;">Visit our website</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
      const info = await this.deliver({
        to: user.email,
        subject: 'Thank You for Your Order - ReSip India',
        html,
      });
      console.log(`📧 Customer order email sent: ${order.orderId} → ${user.email} (${info.messageId})`);
      return info;
    } catch (error) {
      console.error(`❌ Customer order email failed: ${order.orderId} → ${user.email}`, error.message);
      return null;
    }
  }

  /**
   * Admin order notification email with full details in HTML table.
   * Sent only after Cashfree payment is confirmed SUCCESS.
   */
  async sendAdminOrderNotification(order, payment, user) {
    const brandBlue = '#0047ab';
    const adminEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER || 'hello@resipindia.com';
    const isCod = order.paymentMethod === 'cod';
    const orderDate = new Date(order.createdAt).toLocaleString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });

    // Extract Cashfree payment ID and transaction ID from gateway response
    const gatewayData = payment.gatewayResponse || {};
    const cfPaymentId = gatewayData.payment?.cf_payment_id || payment.gatewayOrderId || 'N/A';
    const cfTransactionId = payment.transactionId || 'N/A';

    // Build product rows with SKU
    const productRows = order.items.map((item) => `
      <tr>
        <td style="padding:10px 8px;border:1px solid #dee2e6;font-size:13px;color:#333;">
          ${item.name}
          ${item.setSize ? `<br><span style="color:#888;font-size:11px;">Set of ${item.setSize}</span>` : ''}
          ${item.fragrance ? `<br><span style="color:#888;font-size:11px;">Fragrance: ${item.fragrance}</span>` : ''}
        </td>
        <td style="padding:10px 8px;border:1px solid #dee2e6;font-size:13px;color:#888;text-align:center;">${item.product || ' '}</td>
        <td style="padding:10px 8px;border:1px solid #dee2e6;font-size:13px;color:#333;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 8px;border:1px solid #dee2e6;font-size:13px;color:#333;text-align:right;">₹${item.price?.toLocaleString('en-IN')}</td>
        <td style="padding:10px 8px;border:1px solid #dee2e6;font-size:13px;color:#333;text-align:right;font-weight:bold;">₹${item.subtotal?.toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    // Shipping address
    const addr = order.shippingAddress || {};
    const addressLines = [
      addr.fullName,
      addr.addressLine1,
      addr.addressLine2,
      [addr.city, addr.state, addr.pincode].filter(Boolean).join(', '),
      addr.country,
      addr.phone ? `Phone: ${addr.phone}` : '',
    ].filter(Boolean).join('<br>');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Order Notification</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f4f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:20px 10px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background-color:${brandBlue};padding:25px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">🛒 New Order Received</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">ReSip India Admin Notification</p>
            </td>
          </tr>

          <!-- Order & Customer Details -->
          <tr>
            <td style="padding:25px 30px 10px;">
              <h3 style="margin:0 0 12px;color:${brandBlue};font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">Order Details</h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #dee2e6;border-radius:6px;overflow:hidden;">
                <tr style="background-color:#f8f9fa;">
                  <td style="padding:8px 12px;font-size:13px;color:#888;border-bottom:1px solid #dee2e6;width:40%;">Order ID</td>
                  <td style="padding:8px 12px;font-size:14px;color:#333;font-weight:bold;border-bottom:1px solid #dee2e6;">${order.orderId}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;font-size:13px;color:#888;border-bottom:1px solid #dee2e6;">Order Date & Time</td>
                  <td style="padding:8px 12px;font-size:13px;color:#333;border-bottom:1px solid #dee2e6;">${orderDate}</td>
                </tr>
                <tr style="background-color:#f8f9fa;">
                  <td style="padding:8px 12px;font-size:13px;color:#888;border-bottom:1px solid #dee2e6;">Customer Name</td>
                  <td style="padding:8px 12px;font-size:13px;color:#333;border-bottom:1px solid #dee2e6;">${user.name || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;font-size:13px;color:#888;border-bottom:1px solid #dee2e6;">Customer Email</td>
                  <td style="padding:8px 12px;font-size:13px;color:#333;border-bottom:1px solid #dee2e6;">${user.email || 'N/A'}</td>
                </tr>
                <tr style="background-color:#f8f9fa;">
                  <td style="padding:8px 12px;font-size:13px;color:#888;border-bottom:1px solid #dee2e6;">Customer Phone</td>
                  <td style="padding:8px 12px;font-size:13px;color:#333;border-bottom:1px solid #dee2e6;">${user.phone || addr.phone || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;font-size:13px;color:#888;border-bottom:1px solid #dee2e6;">Payment Status</td>
                  <td style="padding:8px 12px;font-size:13px;color:${isCod ? '#f57f17' : '#27ae60'};font-weight:bold;border-bottom:1px solid #dee2e6;">${isCod ? '💵 COD Pay on Delivery' : '✅ ' + (order.paymentStatus?.toUpperCase() || 'PAID')}</td>
                </tr>
                <tr style="background-color:#f8f9fa;">
                  <td style="padding:8px 12px;font-size:13px;color:#888;border-bottom:1px solid #dee2e6;">Payment Method</td>
                  <td style="padding:8px 12px;font-size:13px;color:#333;border-bottom:1px solid #dee2e6;">${isCod ? 'Cash on Delivery (COD)' : 'Cashfree (Online)'}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;font-size:13px;color:#888;border-bottom:1px solid #dee2e6;">Cashfree Payment ID</td>
                  <td style="padding:8px 12px;font-size:13px;color:#333;font-family:monospace;border-bottom:1px solid #dee2e6;">${cfPaymentId}</td>
                </tr>
                <tr style="background-color:#f8f9fa;">
                  <td style="padding:8px 12px;font-size:13px;color:#888;">Transaction ID</td>
                  <td style="padding:8px 12px;font-size:13px;color:#333;font-family:monospace;">${cfTransactionId}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding:15px 30px 5px;">
              <h3 style="margin:0 0 8px;color:${brandBlue};font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">Shipping Address</h3>
              <div style="background-color:#f8f9fa;border-radius:6px;padding:12px;font-size:13px;color:#333;line-height:1.7;border-left:3px solid ${brandBlue};">
                ${addressLines}
              </div>
            </td>
          </tr>

          <!-- Products Table -->
          <tr>
            <td style="padding:20px 30px 5px;">
              <h3 style="margin:0 0 8px;color:${brandBlue};font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">Products Ordered</h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #dee2e6;border-radius:6px;overflow:hidden;">
                <tr style="background-color:${brandBlue};">
                  <th style="padding:10px 8px;font-size:12px;color:#fff;text-align:left;font-weight:600;">Product</th>
                  <th style="padding:10px 8px;font-size:12px;color:#fff;text-align:center;font-weight:600;">SKU / ID</th>
                  <th style="padding:10px 8px;font-size:12px;color:#fff;text-align:center;font-weight:600;">Qty</th>
                  <th style="padding:10px 8px;font-size:12px;color:#fff;text-align:right;font-weight:600;">Unit Price</th>
                  <th style="padding:10px 8px;font-size:12px;color:#fff;text-align:right;font-weight:600;">Total</th>
                </tr>
                ${productRows}
              </table>
            </td>
          </tr>

          <!-- Totals Table -->
          <tr>
            <td style="padding:15px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #dee2e6;border-radius:6px;overflow:hidden;">
                <tr style="background-color:#f8f9fa;">
                  <td style="padding:8px 12px;font-size:13px;color:#555;border-bottom:1px solid #dee2e6;">Subtotal</td>
                  <td style="padding:8px 12px;font-size:13px;color:#333;text-align:right;border-bottom:1px solid #dee2e6;">₹${order.subtotal?.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;font-size:13px;color:#555;border-bottom:1px solid #dee2e6;">Shipping</td>
                  <td style="padding:8px 12px;font-size:13px;color:#333;text-align:right;border-bottom:1px solid #dee2e6;">${order.shippingCharge === 0 ? 'Free' : '₹' + order.shippingCharge?.toLocaleString('en-IN')}</td>
                </tr>
                <tr style="background-color:#f8f9fa;">
                  <td style="padding:8px 12px;font-size:13px;color:#555;border-bottom:1px solid #dee2e6;">Tax (GST ${order.taxPercent || 18}%)</td>
                  <td style="padding:8px 12px;font-size:13px;color:#333;text-align:right;border-bottom:1px solid #dee2e6;">₹${order.taxAmount?.toLocaleString('en-IN')}</td>
                </tr>
                ${order.codCharge > 0 ? `
                <tr>
                  <td style="padding:8px 12px;font-size:13px;color:#555;border-bottom:1px solid #dee2e6;">COD Charges</td>
                  <td style="padding:8px 12px;font-size:13px;color:#333;text-align:right;border-bottom:1px solid #dee2e6;">₹${order.codCharge?.toLocaleString('en-IN')}</td>
                </tr>` : ''}
                ${order.couponDiscount > 0 ? `
                <tr>
                  <td style="padding:8px 12px;font-size:13px;color:#27ae60;border-bottom:1px solid #dee2e6;">Discount${order.couponCode ? ` (${order.couponCode})` : ''}</td>
                  <td style="padding:8px 12px;font-size:13px;color:#27ae60;text-align:right;border-bottom:1px solid #dee2e6;">−₹${order.couponDiscount?.toLocaleString('en-IN')}</td>
                </tr>` : ''}
                <tr style="background-color:${brandBlue};">
                  <td style="padding:12px;font-size:15px;font-weight:bold;color:#fff;">Grand Total</td>
                  <td style="padding:12px;font-size:15px;font-weight:bold;color:#fff;text-align:right;">₹${order.totalAmount?.toLocaleString('en-IN')}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8f8f8;padding:20px 30px;text-align:center;border-top:1px solid #eee;">
              <p style="margin:0;font-size:11px;color:#999;">This is an automated notification from ReSip India.</p>
              <p style="margin:4px 0 0;font-size:11px;color:#aaa;">© ${new Date().getFullYear()} ReSip India</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
      const info = await this.deliver({
        to: adminEmail,
        subject: 'New Order Received - ReSip India',
        html,
      });
      console.log(`📧 Admin order notification sent: ${order.orderId} → ${adminEmail} (${info.messageId})`);
      return info;
    } catch (error) {
      console.error(`❌ Admin order notification failed: ${order.orderId} → ${adminEmail}`, error.message);
      return null;
    }
  }

  /**
   * Contact / inquiry form submission from the website.
   * Sent to the business inbox; reply-to is set to the customer so staff can
   * reply directly. Throws on failure so the API can report an error to the UI.
   */
  async sendContactInquiry({ name, email, company, orderType, message }) {
    const brandBlue = '#0047ab';
    const to = process.env.CONTACT_EMAIL || 'hello@resipindia.com';
    const safe = (v) => (v ? String(v) : ' ');

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f4f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:20px 10px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:${brandBlue};padding:25px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">📩 New Contact Inquiry</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">ReSip India Website Contact Form</p>
            </td>
          </tr>
          <tr>
            <td style="padding:25px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #dee2e6;border-radius:6px;overflow:hidden;">
                <tr style="background-color:#f8f9fa;">
                  <td style="padding:10px 12px;font-size:13px;color:#888;border-bottom:1px solid #dee2e6;width:35%;">Name</td>
                  <td style="padding:10px 12px;font-size:14px;color:#333;font-weight:bold;border-bottom:1px solid #dee2e6;">${safe(name)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 12px;font-size:13px;color:#888;border-bottom:1px solid #dee2e6;">Email</td>
                  <td style="padding:10px 12px;font-size:14px;color:#333;border-bottom:1px solid #dee2e6;"><a href="mailto:${safe(email)}" style="color:${brandBlue};text-decoration:none;">${safe(email)}</a></td>
                </tr>
                <tr style="background-color:#f8f9fa;">
                  <td style="padding:10px 12px;font-size:13px;color:#888;border-bottom:1px solid #dee2e6;">Company</td>
                  <td style="padding:10px 12px;font-size:14px;color:#333;border-bottom:1px solid #dee2e6;">${safe(company)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 12px;font-size:13px;color:#888;border-bottom:1px solid #dee2e6;">Order Type</td>
                  <td style="padding:10px 12px;font-size:14px;color:#333;border-bottom:1px solid #dee2e6;">${safe(orderType)}</td>
                </tr>
              </table>
              <h3 style="margin:20px 0 8px;color:${brandBlue};font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">Message</h3>
              <div style="background-color:#f8f9fa;border-radius:6px;padding:15px;font-size:14px;color:#333;line-height:1.7;border-left:3px solid ${brandBlue};white-space:pre-wrap;">${safe(message)}</div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f8f8;padding:18px 30px;text-align:center;border-top:1px solid #eee;">
              <p style="margin:0;font-size:11px;color:#999;">Reply to this email to respond directly to the customer.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const info = await this.deliver({
      to,
      subject: `New Contact Inquiry from ${name || 'Website'} ReSip India`,
      html,
      replyTo: email || undefined,
    });
    console.log(`📧 Contact inquiry sent: ${email} → ${to} (${info.messageId})`);
    return info;
  }
}

module.exports = new EmailService();
