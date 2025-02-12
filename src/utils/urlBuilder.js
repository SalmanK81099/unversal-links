const config = require('../config/environment');

const buildIOSUrl = (deepLink, referralCode, clickId) => {
  const baseUrl = config.app.ios.appStoreUrl;
  if (!referralCode || !clickId) return baseUrl;

  return `${baseUrl}&referrer=${encodeURIComponent(
    referralCode
  )}&click_id=${encodeURIComponent(clickId)}`;
};

const buildAndroidUrl = (deepLink, referralCode, clickId) => {
  const baseUrl = config.app.android.playStoreUrl;
  if (!referralCode || !clickId) return baseUrl;

  return `${baseUrl}&referrer=${encodeURIComponent(
    `ref=${referralCode}&click_id=${clickId}`
  )}`;
};

const buildUniversalLink = (scheme, path, queryParams) => {
  const base = `${scheme}${path}`;
  return queryParams ? `${base}?${queryParams}` : base;
};

const buildDeepLink = (path, queryParams) => {
  return `${path}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
};

module.exports = {
  buildIOSUrl,
  buildAndroidUrl,
  buildUniversalLink,
  buildDeepLink,
};
