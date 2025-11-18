import 'server-only';
import { DateTime } from 'luxon';
import crypto from 'crypto';
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

      // Delete TrialRequestLimitIp records whose updatedAt is older than 72 hours
      await db.trialRequestLimitIp.deleteMany({
        where: {
          updatedAt: { lt: DateTime.now().minus({ hours: 72 }).toJSDate() },
        },
      });

      // Delete TrialRequest records older than 3 years
      await db.trialRequest.deleteMany({
        where: {
          expiresAt: { lt: DateTime.now().minus({ years: 3 }).toJSDate() },
        },
      });

      // Anonymize TrialRequest records older than 180 days
      // 1. Find all TrialRequests older than 180 days that are NOT yet anonymized
      const oldTrialRequests = await db.trialRequest.findMany({
        where: {
          expiresAt: {
            lt: DateTime.now().minus({ days: 180 }).toJSDate(),
          },
          NOT: {  // avoid re-anonymizing hashed values
            email: { startsWith: 'anon-' },
          },
        },
      });
      // 2. Update each old TrialRequest to anonymize its hashed email
      for (const trialRequest of oldTrialRequests) {
        const hash = crypto.createHash('sha256').update(trialRequest.email).digest('hex');

        await db.trialRequest.update({
          where: { id: trialRequest.id },
          data: {
            email: `anon-${hash}`,
            firstName: null,
            lastName: null,
            company: null,
            phone: null,
            jobTitle: null,
            country: null,
          },
        });
      }

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
