const express = require('express');
const router = express.Router();
const { apiLimiter } = require('../middleware/rateLimiter');
const ReferralService = require('../services/referralService');

// Verify and retrieve referral data
router.post('/verify-referral', apiLimiter, async (req, res, next) => {
  const { clickId } = req.body;
  const referralData = req.cookies.referralData;

  try {
    const verifiedData = await ReferralService.verifyReferral(clickId);

    if (referralData) {
      res.clearCookie('referralData');
    }

    res.json({
      success: true,
      ...verifiedData,
    });
  } catch (error) {
    if (error.message === 'Referral not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Referral already converted') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

// Get referral statistics
router.get('/referral-stats', apiLimiter, async (req, res, next) => {
  try {
    const stats = await ReferralService.getReferralStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
