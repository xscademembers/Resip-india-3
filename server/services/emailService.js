const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

class EmailService {
  constructor() {
    this.transporter = null;
    this.from = process.env.EMAIL_FROM || 'ReSip India <noreply@resipindia.com>';
    this.clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  }

  /**
   * Initialize the SMTP transporter (lazy init).
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
        <p style="color:#555;line-height:1.6;">At ReSip India, we transform discarded bottles into stunning, handcrafted glassware — sustainable luxury for your home.</p>
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
      
      const mailOptions = {
        from: this.from,
        to,
        subject,
        html,
      };

      const info = await this.getTransporter().sendMail(mailOptions);
      console.log(`📧 Email sent: ${subject} → ${to} (${info.messageId})`);
      return info;
    } catch (error) {
      console.error(`❌ Email failed: ${subject} → ${to}`, error.message);
      // Don't throw — email failures shouldn't break the flow
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
      subject: 'Verify Your Email — ReSip India',
      template: 'verification',
      variables: { name: user.name, verificationUrl },
    });
  }

  async sendForgotPasswordEmail(user, token) {
    const resetUrl = `${this.clientUrl}/reset-password/${token}`;
    return this.send({
      to: user.email,
      subject: 'Reset Your Password — ReSip India',
      template: 'forgotPassword',
      variables: { name: user.name, resetUrl },
    });
  }

  async sendPasswordResetConfirmation(user) {
    return this.send({
      to: user.email,
      subject: 'Password Changed — ReSip India',
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
      subject: `Order Confirmed: ${order.orderId} — ReSip India`,
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
      subject: `Payment Received: ${order.orderId} — ReSip India`,
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
      subject: `Payment Failed: ${order.orderId} — ReSip India`,
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
      subject: `Order ${order.orderStatus}: ${order.orderId} — ReSip India`,
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
      subject: `Order Cancelled: ${order.orderId} — ReSip India`,
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
      subject: `Refund Processed: ${order.orderId} — ReSip India`,
      template: 'refundCompleted',
      variables: {
        name: user.name,
        orderId: order.orderId,
        refundAmount: refundAmount?.toLocaleString('en-IN'),
        refundId,
      },
    });
  }
}

module.exports = new EmailService();
