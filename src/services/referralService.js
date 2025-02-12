const { v4: uuidv4 } = require('uuid');
const ReferralClick = require('../models/ReferralClick');
const config = require('../config/environment');
const { getDeviceInfo } = require('../utils/deviceDetection');

class ReferralService {
  static async storeReferralData(req, res, referralData) {
    const clickId = uuidv4();

    // Store in cookie
    const cookieOptions = {
      maxAge: config.security.cookieMaxAge,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    };

    const enrichedReferralData = {
      ...referralData,
      clickId,
    };

    res.cookie(
      'referralData',
      JSON.stringify(enrichedReferralData),
      cookieOptions
    );

    // Store in database
    try {
      const referralClick = new ReferralClick({
        clickId,
        referralCode: referralData.referralCode,
        source: referralData.source,
        campaign: referralData.campaign,
        userAgent: req.useragent.source,
        ipAddress: req.ip,
        deviceInfo: getDeviceInfo(req.useragent),
      });

      await referralClick.save();
      return clickId;
    } catch (error) {
      console.error('Error storing referral click:', error);
      throw error;
    }
  }

  static async verifyReferral(clickId) {
    const referralClick = await ReferralClick.findOne({ clickId });

    if (!referralClick) {
      throw new Error('Referral not found');
    }

    if (referralClick.converted) {
      throw new Error('Referral already converted');
    }

    referralClick.converted = true;
    referralClick.conversionTimestamp = new Date();
    await referralClick.save();

    return {
      referralCode: referralClick.referralCode,
      source: referralClick.source,
      campaign: referralClick.campaign,
    };
  }

  static async getReferralStats() {
    const stats = await ReferralClick.aggregate([
      {
        $group: {
          _id: '$referralCode',
          totalClicks: { $sum: 1 },
          conversions: {
            $sum: { $cond: ['$converted', 1, 0] },
          },
          sources: { $addToSet: '$source' },
          campaigns: { $addToSet: '$campaign' },
        },
      },
      {
        $project: {
          _id: 0,
          referralCode: '$_id',
          totalClicks: 1,
          conversions: 1,
          conversionRate: {
            $multiply: [{ $divide: ['$conversions', '$totalClicks'] }, 100],
          },
          sources: 1,
          campaigns: 1,
        },
      },
    ]);

    return stats;
  }
}

module.exports = ReferralService;
