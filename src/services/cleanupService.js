const ReferralClick = require('../models/ReferralClick');
const config = require('../config/environment');

class CleanupService {
  static async cleanupOldReferrals() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await ReferralClick.deleteMany({
        converted: false,
        createdAt: { $lt: thirtyDaysAgo },
      });

      console.log(`Cleaned up ${result.deletedCount} old referral records`);
    } catch (error) {
      console.error('Error cleaning up old referrals:', error);
    }
  }

  static startCleanupSchedule() {
    // Run cleanup daily
    setInterval(
      this.cleanupOldReferrals,
      24 * 60 * 60 * 1000 // 24 hours
    );
  }
}

module.exports = CleanupService;
