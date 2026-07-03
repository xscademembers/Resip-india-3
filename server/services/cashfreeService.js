const crypto = require('crypto');
const axios = require('axios');

/**
 * Cashfree Payment Gateway — Standard Checkout integration.
 *
 * Uses App ID + Secret Key headers (x-client-id / x-client-secret) for
 * server-side API calls. The frontend loads the Cashfree JS SDK and opens
 * the hosted checkout using the `payment_session_id` returned by createOrder.
 *
 * Docs: https://docs.cashfree.com/docs/payment-gateway
 */
const CASHFREE_HOSTS = {
  SANDBOX: 'https://sandbox.cashfree.com/pg',
  PRODUCTION: 'https://api.cashfree.com/pg',
};

const API_VERSION = '2025-01-01';

class CashfreeService {
  constructor() {
    this.appId = process.env.CASHFREE_APP_ID;
    this.secretKey = process.env.CASHFREE_SECRET_KEY;

    const env = (process.env.CASHFREE_ENV || 'SANDBOX').toUpperCase();
    this.isProduction = env === 'PRODUCTION' || env === 'PROD';
    this.baseUrl = this.isProduction
      ? CASHFREE_HOSTS.PRODUCTION
      : CASHFREE_HOSTS.SANDBOX;
  }

  /** Returns true when both App ID and Secret Key are configured. */
  isConfigured() {
    return Boolean(this.appId && this.secretKey);
  }

  /** Standard headers for every Cashfree PG API call. */
  _headers() {
    return {
      'Content-Type': 'application/json',
      'x-client-id': this.appId,
      'x-client-secret': this.secretKey,
      'x-api-version': API_VERSION,
    };
  }

  /**
   * Create a Cashfree order and return the `payment_session_id` for the
   * frontend Checkout SDK plus the Cashfree `cf_order_id`.
   *
   * @param {object} opts
   * @param {string} opts.orderId      – Your internal order ID (unique per attempt).
   * @param {number} opts.amount       – Amount in INR (rupees, not paise).
   * @param {object} opts.customerDetails – { id, email, phone, name }
   * @param {string} opts.returnUrl    – Where Cashfree redirects the user after payment.
   * @param {string} [opts.notifyUrl]  – Webhook URL for server-to-server callbacks.
   */
  async createOrder({ orderId, amount, customerDetails, returnUrl, notifyUrl }) {
    if (!this.isConfigured()) {
      throw new Error('Cashfree is not configured (missing APP_ID / SECRET_KEY)');
    }

    const payload = {
      order_id: orderId,
      order_amount: parseFloat(amount.toFixed(2)),
      order_currency: 'INR',
      customer_details: {
        customer_id: customerDetails.id,
        customer_email: customerDetails.email || 'customer@resipindia.com',
        customer_phone: customerDetails.phone || '9999999999',
        customer_name: customerDetails.name || 'Customer',
      },
      order_meta: {
        return_url: returnUrl,
        ...(notifyUrl ? { notify_url: notifyUrl } : {}),
      },
    };

    try {
      const { data } = await axios.post(`${this.baseUrl}/orders`, payload, {
        headers: this._headers(),
        timeout: 15000,
      });

      return {
        success: true,
        cfOrderId: data.cf_order_id,
        orderId: data.order_id,
        paymentSessionId: data.payment_session_id,
        orderStatus: data.order_status,
        data,
      };
    } catch (error) {
      console.error(
        'Cashfree create order error:',
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || 'Cashfree order creation failed'
      );
    }
  }

  /**
   * Fetch the current status of a Cashfree order.
   * Returns a normalised { success, status, state, data } object.
   *
   * Cashfree order_status values: ACTIVE | PAID | EXPIRED
   */
  async getOrderStatus(orderId) {
    try {
      const { data } = await axios.get(`${this.baseUrl}/orders/${orderId}`, {
        headers: this._headers(),
        timeout: 15000,
      });

      const orderStatus = data.order_status; // ACTIVE | PAID | EXPIRED
      const status =
        orderStatus === 'PAID'
          ? 'success'
          : orderStatus === 'ACTIVE'
            ? 'pending'
            : 'failed';

      return {
        success: orderStatus === 'PAID',
        state: orderStatus,
        status,
        data,
      };
    } catch (error) {
      console.error(
        'Cashfree order status error:',
        error.response?.data || error.message
      );
      throw new Error('Payment status check failed');
    }
  }

  /**
   * Fetch the payments made against a Cashfree order.
   * Useful when you need the payment method, UTR, etc.
   */
  async getOrderPayments(orderId) {
    try {
      const { data } = await axios.get(
        `${this.baseUrl}/orders/${orderId}/payments`,
        { headers: this._headers(), timeout: 15000 }
      );
      return { success: true, payments: data };
    } catch (error) {
      console.error(
        'Cashfree payments fetch error:',
        error.response?.data || error.message
      );
      throw new Error('Failed to fetch payment details');
    }
  }

  /**
   * Create a refund for a paid Cashfree order.
   *
   * @param {object} opts
   * @param {string} opts.orderId       – The Cashfree order_id.
   * @param {string} opts.refundId      – Your unique refund identifier.
   * @param {number} opts.refundAmount  – Amount in INR.
   * @param {string} [opts.refundNote]  – Reason / note.
   */
  async createRefund({ orderId, refundId, refundAmount, refundNote }) {
    const payload = {
      refund_amount: parseFloat(refundAmount.toFixed(2)),
      refund_id: refundId,
      refund_note: refundNote || 'Refund by ReSip India',
      refund_speed: 'STANDARD',
    };

    try {
      const { data } = await axios.post(
        `${this.baseUrl}/orders/${orderId}/refunds`,
        payload,
        {
          headers: {
            ...this._headers(),
            'x-idempotency-key': refundId, // Prevent duplicate refunds
          },
          timeout: 15000,
        }
      );
      return { success: true, data };
    } catch (error) {
      console.error(
        'Cashfree refund error:',
        error.response?.data || error.message
      );
      throw new Error('Refund initiation failed');
    }
  }

  /**
   * Verify a Cashfree webhook signature.
   *
   * Cashfree signs webhooks with HMAC-SHA256 using your Secret Key.
   * Signature = base64(HMAC-SHA256(timestamp + rawBody, secretKey))
   *
   * @param {string} signature  – The `x-webhook-signature` header value.
   * @param {string} rawBody    – The raw (unparsed) request body string.
   * @param {string} timestamp  – The `x-webhook-timestamp` header value.
   * @returns {boolean}
   */
  verifyWebhook(signature, rawBody, timestamp) {
    if (!this.secretKey) {
      // No secret configured — skip verification in dev.
      console.warn('Cashfree webhook verification skipped (no secret key)');
      return true;
    }

    if (!signature || !rawBody || !timestamp) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(timestamp + rawBody)
      .digest('base64');

    return signature === expectedSignature;
  }
}

module.exports = new CashfreeService();
