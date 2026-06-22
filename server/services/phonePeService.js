const crypto = require('crypto');
const axios = require('axios');

/**
 * PhonePe Payment Gateway — Standard Checkout V2 integration.
 *
 * V2 uses OAuth client credentials (client_id / client_secret / client_version)
 * to fetch a short-lived access token, which is then sent as an
 * `Authorization: O-Bearer <token>` header on every API call. The old V1
 * salt-key / X-VERIFY signing is no longer used.
 *
 * Docs: https://developer.phonepe.com/payment-gateway/website-integration/standard-checkout
 */
const PHONEPE_HOSTS = {
  SANDBOX: {
    oauth: 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token',
    pg: 'https://api-preprod.phonepe.com/apis/pg-sandbox',
  },
  PRODUCTION: {
    oauth: 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token',
    pg: 'https://api.phonepe.com/apis/pg',
  },
};

class PhonePeService {
  constructor() {
    this.clientId = process.env.PHONEPE_CLIENT_ID;
    this.clientSecret = process.env.PHONEPE_CLIENT_SECRET;
    this.clientVersion = process.env.PHONEPE_CLIENT_VERSION || '1';

    // Accept a few spellings; default to the sandbox for safety.
    const env = (process.env.PHONEPE_ENV || 'SANDBOX').toUpperCase();
    this.isProduction = env === 'PRODUCTION' || env === 'PROD';
    this.hosts = this.isProduction ? PHONEPE_HOSTS.PRODUCTION : PHONEPE_HOSTS.SANDBOX;

    // Cached OAuth token.
    this._accessToken = null;
    this._tokenExpiresAt = 0; // epoch seconds
  }

  isConfigured() {
    return Boolean(this.clientId && this.clientSecret);
  }

  /**
   * Fetch (and cache) an OAuth access token. Refreshes ~1 min before expiry.
   */
  async getAccessToken() {
    const now = Math.floor(Date.now() / 1000);
    if (this._accessToken && now < this._tokenExpiresAt - 60) {
      return this._accessToken;
    }

    if (!this.isConfigured()) {
      throw new Error('PhonePe is not configured (missing client credentials)');
    }

    const body = new URLSearchParams({
      client_id: this.clientId,
      client_version: this.clientVersion,
      client_secret: this.clientSecret,
      grant_type: 'client_credentials',
    });

    try {
      const { data } = await axios.post(this.hosts.oauth, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 15000,
      });

      this._accessToken = data.access_token;
      // `expires_at` is an epoch timestamp (seconds).
      this._tokenExpiresAt = data.expires_at || now + 3000;
      return this._accessToken;
    } catch (error) {
      console.error('PhonePe auth error:', error.response?.data || error.message);
      throw new Error('PhonePe authentication failed');
    }
  }

  async authHeaders() {
    const token = await this.getAccessToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `O-Bearer ${token}`,
    };
  }

  /**
   * Initiate a Standard Checkout payment.
   * Returns the hosted checkout `redirectUrl` to send the user to.
   */
  async initiatePayment({ merchantOrderId, amount, redirectUrl }) {
    const payload = {
      merchantOrderId,
      amount: Math.round(amount * 100), // rupees → paise
      paymentFlow: {
        type: 'PG_CHECKOUT',
        merchantUrls: { redirectUrl },
      },
    };

    try {
      const response = await axios.post(
        `${this.hosts.pg}/checkout/v2/pay`,
        payload,
        { headers: await this.authHeaders(), timeout: 15000 }
      );

      return {
        success: true,
        orderId: response.data.orderId,
        redirectUrl: response.data.redirectUrl,
        state: response.data.state,
        data: response.data,
      };
    } catch (error) {
      console.error('PhonePe initiation error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Payment initiation failed'
      );
    }
  }

  /**
   * Check the status of an order by the merchant order ID.
   */
  async checkStatus(merchantOrderId) {
    try {
      const response = await axios.get(
        `${this.hosts.pg}/checkout/v2/order/${merchantOrderId}/status`,
        { headers: await this.authHeaders(), timeout: 15000 }
      );

      const state = response.data.state; // COMPLETED | PENDING | FAILED
      const status =
        state === 'COMPLETED' ? 'success' : state === 'PENDING' ? 'pending' : 'failed';

      return { success: state === 'COMPLETED', state, status, data: response.data };
    } catch (error) {
      console.error('PhonePe status check error:', error.response?.data || error.message);
      throw new Error('Payment status check failed');
    }
  }

  /**
   * Initiate a refund for a completed order.
   */
  async initiateRefund({ merchantRefundId, originalMerchantOrderId, amount }) {
    const payload = {
      merchantRefundId,
      originalMerchantOrderId,
      amount: Math.round(amount * 100),
    };

    try {
      const response = await axios.post(
        `${this.hosts.pg}/payments/v2/refund`,
        payload,
        { headers: await this.authHeaders(), timeout: 15000 }
      );

      return { success: true, data: response.data };
    } catch (error) {
      console.error('PhonePe refund error:', error.response?.data || error.message);
      throw new Error('Refund initiation failed');
    }
  }

  /**
   * Verify a V2 webhook callback. PhonePe signs callbacks with the SHA256 of
   * the `username:password` you configure in the dashboard, sent in the
   * Authorization header. Returns true when verification passes (or when no
   * callback credentials are configured, e.g. in local development).
   */
  verifyCallback(authorizationHeader) {
    const username = process.env.PHONEPE_CALLBACK_USERNAME;
    const password = process.env.PHONEPE_CALLBACK_PASSWORD;

    if (!username || !password) {
      return true; // No webhook auth configured — skip verification.
    }

    const expected = crypto
      .createHash('sha256')
      .update(`${username}:${password}`)
      .digest('hex');

    const received = (authorizationHeader || '').replace(/^SHA256=/i, '').trim();
    return received === expected;
  }
}

module.exports = new PhonePeService();
