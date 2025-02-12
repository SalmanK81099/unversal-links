const isIOS = (ua) => ua.isiPhone || ua.isiPad || ua.isiPod;
const isAndroid = (ua) => ua.isAndroid;
const isMobile = (ua) => isIOS(ua) || isAndroid(ua);

const isAutomatedRequest = (userAgent) => {
  const lowerUA = userAgent.source.toLowerCase();
  return (
    lowerUA.includes('node-fetch') ||
    lowerUA.includes('bot') ||
    lowerUA.includes('crawler') ||
    lowerUA.includes('spider') ||
    lowerUA.includes('health') ||
    lowerUA.includes('monitor') ||
    lowerUA.includes('pingdom') ||
    lowerUA.includes('uptimerobot')
  );
};

const getDeviceInfo = (userAgent) => ({
  platform: userAgent.platform,
  browser: userAgent.browser,
  device: userAgent.isMobile ? 'mobile' : 'desktop',
});

module.exports = {
  isIOS,
  isAndroid,
  isMobile,
  isAutomatedRequest,
  getDeviceInfo,
};
