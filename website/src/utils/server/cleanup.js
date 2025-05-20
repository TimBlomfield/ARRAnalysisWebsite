import 'server-only';
import { DateTime } from 'luxon';
import db from '@/utils/server/db';


const runCleanup = async () => {
  try {
    const lastCleanup = await db.cleanupLog.findUnique({ where: { id: 1 } });

    if (!lastCleanup || DateTime.now().diff(DateTime.fromJSDate(lastCleanup.lastRun), 'days').days > 6) {
      // Delete all 'stray' UserData i.e. UserData with no admin, customer, or user relations
      await db.userData.deleteMany({
        where: {
          admin: null,
          customer: null,
          user: null,
        },
      });

      // Delete AuditLog records older than 90 days
      const ninetyDaysAgo = DateTime.now().minus({ days: 90 }).toJSDate();
      await db.auditLog.deleteMany({
        where: {
          createdAt: { lt: ninetyDaysAgo },
        },
      });

      // Delete expired RegistrationLink's
      const dtNow = DateTime.now().toJSDate();
      await db.registrationLink.deleteMany({
        where: {
          expiresAt: { lt: dtNow },
        },
      });

      // Delete expired ResetPasswordLink's
      await db.resetPasswordLink.deleteMany({
        where: {
          expiresAt: { lt: dtNow },
        },
      });

      // Update/Create the CleanupLog singleton object
      const lastRun = DateTime.now().toJSDate();
      await db.cleanupLog.upsert({
        where: { id: 1 },
        update: { lastRun },
        create: { id: 1, lastRun },
      });

      return true;
    }
  } catch (error) {
    console.error(error.message);
  }

  return false;
};


export {
  runCleanup,
};
