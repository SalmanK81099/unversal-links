const express = require('express');
const router = express.Router();
const path = require('path');
const ReferralService = require('../services/referralService');
const {
  isIOS,
  isAndroid,
  isMobile,
  isAutomatedRequest,
} = require('../utils/deviceDetection');
const {
  buildIOSUrl,
  buildAndroidUrl,
  buildUniversalLink,
  buildDeepLink,
} = require('../utils/urlBuilder');
const config = require('../config/environment');

// HTML generation for smart banner
const generateSmartBannerHTML = require('../utils/smartBanner');

// Platform-specific handlers
function handleIOSRedirect(res, deepLink, referralCode, clickId) {
  const iosUniversalLink = buildUniversalLink(
    config.app.ios.scheme,
    deepLink,
    ''
  );
  const finalAppStoreURL = buildIOSUrl(deepLink, referralCode, clickId);

  const html = generateSmartBannerHTML({
    title: 'Open in App',
    appStoreURL: finalAppStoreURL,
    universalLink: iosUniversalLink,
    platform: 'ios',
    referralCode,
    clickId,
  });

  res.send(html);
}

function handleAndroidRedirect(res, deepLink, referralCode, clickId) {
  const androidIntent = buildUniversalLink(
    config.app.android.scheme,
    deepLink,
    ''
  );
  const finalPlayStoreURL = buildAndroidUrl(deepLink, referralCode, clickId);

  const html = generateSmartBannerHTML({
    title: 'Open in App',
    playStoreURL: finalPlayStoreURL,
    intentURL: androidIntent,
    platform: 'android',
    referralCode,
    clickId,
  });

  res.send(html);
}

function handleWebFallback(res) {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
}

// Deep linking route handler
router.get('/:path(*)', async (req, res, next) => {
  try {
    const userAgent = req.useragent;
    const path = req.params.path || '';
    const queryParams = new URLSearchParams(req.query);

    // Skip tracking for automated requests
    if (isAutomatedRequest(userAgent)) {
      return handleWebFallback(res);
    }

    // Extract referral data
    const referralCode = queryParams.get('ref') || queryParams.get('referral');
    const source = queryParams.get('source') || 'direct';
    const campaign = queryParams.get('utm_campaign');

    // Store referral data if present
    let clickId;
    if (referralCode || source !== 'direct' || campaign) {
      const referralData = { referralCode, source, campaign };
      clickId = await ReferralService.storeReferralData(req, res, referralData);
    }

    const deepLink = buildDeepLink(path, queryParams);

    // Handle device-specific redirects
    if (isMobile(userAgent)) {
      if (isIOS(userAgent)) {
        return handleIOSRedirect(res, deepLink, referralCode, clickId);
      }
      if (isAndroid(userAgent)) {
        return handleAndroidRedirect(res, deepLink, referralCode, clickId);
      }
    }

    handleWebFallback(res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
