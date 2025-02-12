const mongoose = require('mongoose');

const ReferralClickSchema = new mongoose.Schema(
  {
    clickId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    referralCode: {
      type: String,
      index: true,
    },
    source: String,
    campaign: String,
    userAgent: String,
    ipAddress: String,
    deviceInfo: {
      platform: String,
      browser: String,
      device: String,
    },
    converted: {
      type: Boolean,
      default: false,
      index: true,
    },
    conversionTimestamp: Date,
  },
  {
    timestamps: true,
  }
);

// Add compound index for analytics queries
ReferralClickSchema.index({ referralCode: 1, converted: 1 });

// Add TTL index for automatic cleanup of old records
ReferralClickSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 } // 30 days
);

module.exports = mongoose.model('ReferralClick', ReferralClickSchema);
