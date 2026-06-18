const crypto = require('crypto');
const axios = require('axios');

const PHONEPE_URLS = {
  UAT: 'https://api-preprod.phonepe.com/apis/pg-sandbox',
  PROD: 'https://api.phonepe.com/apis/hermes',
};

class PhonePeService {
  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID;
    this.saltKey = process.env.PHONEPE_SALT_KEY;
    this.saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
    this.env = process.env.PHONEPE_ENV || 'UAT';
    this.baseUrl = PHONEPE_URLS[this.env] || PHONEPE_URLS.UAT;
  }

  /**
   * Generate SHA256 checksum for PhonePe API.
   */
  generateChecksum(payload, endpoint) {
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const string = base64Payload + endpoint + this.saltKey;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    return {
      base64Payload,
      checksum: `${sha256}###${this.saltIndex}`,
    };
  }

  /**
   * Verify callback checksum from PhonePe.
   */
  verifyChecksum(xVerifyHeader, responseBody) {
    const string = responseBody + this.saltKey;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const expectedChecksum = `${sha256}###${this.saltIndex}`;
    return xVerifyHeader === expectedChecksum;
  }

  /**
   * Initiate a payment request with PhonePe Standard Checkout.
   */
  async initiatePayment({ merchantTransactionId, amount, userId, redirectUrl, callbackUrl }) {
    const payload = {
      merchantId: this.merchantId,
      merchantTransactionId,
      merchantUserId: userId,
      amount: Math.round(amount * 100), // PhonePe expects paise
      redirectUrl,
      redirectMode: 'REDIRECT',
      callbackUrl,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    const endpoint = '/pg/v1/pay';
    const { base64Payload, checksum } = this.generateChecksum(payload, endpoint);

    try {
      const response = await axios.post(
        `${this.baseUrl}${endpoint}`,
        { request: base64Payload },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
          },
        }
      );

      return {
        success: response.data.success,
        redirectUrl: response.data.data?.instrumentResponse?.redirectInfo?.url,
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
   * Check payment status.
   */
  async checkStatus(merchantTransactionId) {
    const endpoint = `/pg/v1/status/${this.merchantId}/${merchantTransactionId}`;
    const string = endpoint + this.saltKey;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = `${sha256}###${this.saltIndex}`;

    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': this.merchantId,
        },
      });

      return {
        success: response.data.success,
        code: response.data.code,
        status: response.data.code === 'PAYMENT_SUCCESS' ? 'success' : 
                response.data.code === 'PAYMENT_PENDING' ? 'pending' : 'failed',
        data: response.data.data,
      };
    } catch (error) {
      console.error('PhonePe status check error:', error.response?.data || error.message);
      throw new Error('Payment status check failed');
    }
  }

  /**
   * Initiate a refund.
   */
  async initiateRefund({ merchantTransactionId, originalTransactionId, amount }) {
    const payload = {
      merchantId: this.merchantId,
      merchantTransactionId,
      originalTransactionId,
      amount: Math.round(amount * 100),
    };

    const endpoint = '/pg/v1/refund';
    const { base64Payload, checksum } = this.generateChecksum(payload, endpoint);

    try {
      const response = await axios.post(
        `${this.baseUrl}${endpoint}`,
        { request: base64Payload },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
          },
        }
      );

      return {
        success: response.data.success,
        data: response.data,
      };
    } catch (error) {
      console.error('PhonePe refund error:', error.response?.data || error.message);
      throw new Error('Refund initiation failed');
    }
  }
}

module.exports = new PhonePeService();
