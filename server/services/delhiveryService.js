const axios = require('axios');

/**
 * Delhivery Express   shipping / logistics integration.
 *
 * GST, HSN, and weight are configured in Delhivery One   not passed from here.
 * Docs: https://delhivery-express-api-doc.readme.io/
 */
const DELHIVERY_HOSTS = {
  STAGING: 'https://staging-express.delhivery.com',
  PRODUCTION: 'https://track.delhivery.com',
};

class DelhiveryService {
  constructor() {
    this.apiToken = process.env.DELHIVERY_API_TOKEN;
    this.pickupLocations = this._parsePickupLocations(process.env.DELHIVERY_PICKUP_LOCATION);

    const env = (process.env.DELHIVERY_ENV || 'STAGING').toUpperCase();
    this.isProduction = env === 'PRODUCTION' || env === 'PROD';
    this.baseUrl = this.isProduction
      ? DELHIVERY_HOSTS.PRODUCTION
      : DELHIVERY_HOSTS.STAGING;

    if (!this.apiToken || this.pickupLocations.length === 0) {
      console.warn('⚠️  Delhivery: DELHIVERY_API_TOKEN or DELHIVERY_PICKUP_LOCATION is missing');
    } else {
      console.log(
        `✅ Delhivery: configured (${this.isProduction ? 'PRODUCTION' : 'STAGING'})   ${this.pickupLocations.length} pickup location(s)`
      );
    }
  }

  _parsePickupLocations(raw) {
    return String(raw || '')
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean);
  }

  isConfigured() {
    return Boolean(this.apiToken && this.pickupLocations.length > 0);
  }

  /** Registered pickup locations (first entry is the default). */
  getPickupLocations() {
    return [...this.pickupLocations];
  }

  getDefaultPickupLocation() {
    return this.pickupLocations[0] || '';
  }

  _resolvePickupLocation(name) {
    const requested = String(name || '').trim();
    if (!requested) return this.getDefaultPickupLocation();

    const match = this.pickupLocations.find(
      (loc) => loc.toLowerCase() === requested.toLowerCase()
    );
    if (!match) {
      throw new Error(
        `Invalid pickup location "${requested}". Use one of: ${this.pickupLocations.join(', ')}`
      );
    }
    return match;
  }

  /** Strip characters Delhivery rejects in shipment payloads. */
  _sanitize(value) {
    return String(value || '')
      .replace(/[&\#%;\\]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  _normalizePhone(phone) {
    const digits = String(phone || '').replace(/\D/g, '');
    if (digits.length >= 10) return digits.slice(-10);
    return digits;
  }

  /**
   * Check whether Delhivery can deliver to a pincode.
   * @param {string} pincode
   */
  async checkPincodeServiceability(pincode) {
    if (!this.isConfigured()) {
      throw new Error('Delhivery is not configured');
    }

    const code = String(pincode || '').trim();
    if (!/^\d{6}$/.test(code)) {
      throw new Error('Invalid pincode');
    }

    const { data } = await axios.get(
      `${this.baseUrl}/c/api/pin-codes/json/`,
      {
        params: { filter_codes: code },
        headers: { Authorization: `Token ${this.apiToken}` },
        timeout: 15000,
      }
    );

    const entry = Array.isArray(data?.delivery_codes)
      ? data.delivery_codes.find((row) => String(row?.postal_code?.pin) === code)
      : null;

    if (!entry) {
      return {
        pincode: code,
        serviceable: false,
        prepaid: false,
        cod: false,
        message: 'Pincode is not serviceable',
      };
    }

    const flags = entry.postal_code || {};
    return {
      pincode: code,
      serviceable: Boolean(flags.pre_paid === 'Y' || flags.cod === 'Y'),
      prepaid: flags.pre_paid === 'Y',
      cod: flags.cod === 'Y',
      message: flags.pre_paid === 'Y' || flags.cod === 'Y'
        ? 'Pincode is serviceable'
        : 'Pincode is not serviceable',
      raw: entry,
    };
  }

  /**
   * Create a forward shipment for an order and return the waybill (AWB).
   * @param {import('../models/Order')} order   Mongoose order document
   * @param {{ pickupLocation?: string }} [opts]
   */
  async createShipment(order, opts = {}) {
    if (!this.isConfigured()) {
      throw new Error('Delhivery is not configured (missing API token or pickup location)');
    }

    const pickupLocation = this._resolvePickupLocation(opts.pickupLocation);

    const addr = order.shippingAddress;
    if (!addr?.pincode || !addr?.phone || !addr?.addressLine1) {
      throw new Error('Order is missing required shipping address fields');
    }

    const isCod = order.paymentMethod === 'cod';
    const paymentMode = isCod ? 'COD' : 'Pre-paid';
    const productsDesc = order.items
      .map((item) => `${item.name} x${item.quantity}`)
      .join(', ')
      .slice(0, 240);
    const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

    const shipmentData = {
      shipments: [
        {
          name: this._sanitize(addr.fullName),
          add: this._sanitize(`${addr.addressLine1}${addr.addressLine2 ? `, ${addr.addressLine2}` : ''}`),
          pin: String(addr.pincode),
          city: this._sanitize(addr.city),
          state: this._sanitize(addr.state),
          country: addr.country || 'India',
          phone: this._normalizePhone(addr.phone),
          order: order.orderId,
          payment_mode: paymentMode,
          products_desc: this._sanitize(productsDesc || 'ReSip India order'),
          cod_amount: isCod ? String(Math.round(order.totalAmount)) : '0',
          total_amount: String(Math.round(order.totalAmount)),
          quantity: String(totalQty || 1),
          shipping_mode: 'Surface',
        },
      ],
      pickup_location: {
        name: pickupLocation,
      },
    };

    const body = `format=json&data=${encodeURIComponent(JSON.stringify(shipmentData))}`;

    try {
      const { data } = await axios.post(
        `${this.baseUrl}/api/cmu/create.json`,
        body,
        {
          headers: {
            Authorization: `Token ${this.apiToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 20000,
        }
      );

      const pkg = Array.isArray(data?.packages) ? data.packages[0] : null;
      const waybill = pkg?.waybill || data?.waybill;

      if (!waybill) {
        const errMsg = pkg?.remarks?.join?.(', ')
          || data?.rmk
          || data?.error
          || JSON.stringify(data);
        throw new Error(`Delhivery did not return a waybill: ${errMsg}`);
      }

      return {
        success: true,
        waybill: String(waybill),
        pickupLocation,
        status: pkg?.status || data?.status || 'Success',
        data,
      };
    } catch (error) {
      const errData = error.response?.data;
      console.error('Delhivery create shipment error:', JSON.stringify(errData || error.message));
      const message = errData?.error
        || errData?.rmk
        || error.message
        || 'Delhivery shipment creation failed';
      throw new Error(message);
    }
  }

  /**
   * Fetch tracking scans for a waybill.
   * @param {string} waybill
   */
  async trackShipment(waybill) {
    if (!this.isConfigured()) {
      throw new Error('Delhivery is not configured');
    }

    const { data } = await axios.get(
      `${this.baseUrl}/api/v1/packages/json/`,
      {
        params: { waybill },
        headers: { Authorization: `Token ${this.apiToken}` },
        timeout: 15000,
      }
    );

    const shipment = Array.isArray(data?.ShipmentData)
      ? data.ShipmentData[0]?.Shipment
      : data?.Shipment;

    const scans = shipment?.Scans?.Scan || [];
    const scanList = Array.isArray(scans) ? scans : scans ? [scans] : [];

    return {
      success: true,
      waybill,
      status: shipment?.Status?.Status || shipment?.Status || null,
      scans: scanList.map((scan) => ({
        status: scan?.ScanDetail?.Scan || scan?.ScanDetail?.Instructions || scan?.Status || '',
        location: scan?.ScanDetail?.ScannedLocation || '',
        timestamp: scan?.ScanDetail?.StatusDateTime || scan?.ScanDetail?.ScanDateTime || '',
      })),
      raw: data,
    };
  }

  /** Public Delhivery tracking page URL for customers. */
  getTrackingUrl(waybill) {
    return `https://www.delhivery.com/track/package/${encodeURIComponent(waybill)}`;
  }
}

module.exports = new DelhiveryService();
