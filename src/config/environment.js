require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  app: {
    ios: {
      appStoreUrl: process.env.IOS_APP_STORE_URL,
      scheme: process.env.IOS_APP_SCHEME,
      bundleId: process.env.IOS_BUNDLE_ID,
      minVersion: process.env.IOS_MIN_VERSION,
    },
    android: {
      playStoreUrl: process.env.ANDROID_PLAY_STORE_URL,
      scheme: process.env.ANDROID_APP_SCHEME,
      packageName: process.env.ANDROID_PACKAGE_NAME,
      minVersion: process.env.ANDROID_MIN_VERSION,
    },
  },
  security: {
    cookieMaxAge: 24 * 60 * 60 * 1000, // 24 hours
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
  },
  cleanup: {
    referralExpiry: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
};
