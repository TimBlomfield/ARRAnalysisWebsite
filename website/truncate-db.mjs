// Truncate database
// Options:
// --all: Clears all the data
// --auditlog: Clears the audit log
// --customers: Clears the customers
// --users: Clears the users
// --admins: Clears the admins
// --links: Clears RegistrationLink and ResetPasswordLink entries
// --trial: Clears TrialRequest and TrialRequestLimitIp entries
// --stray: Clears all 'stray' UserData i.e., UserData with no admin, customer, or user relations

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const truncate = async () => {
  const args = new Set(process.argv.slice(2));

  const bAll = args.has('--all');
  const bAuditLog = args.has('--auditlog');
  const bCustomers = args.has('--customers');
  const bUsers = args.has('--users');
  const bAdmins = args.has('--admins');
  const bLinks = args.has('--links');
  const bTrial = args.has('--trial');
  const bStray = args.has('--stray');

  if (bLinks || bAll) {
    const { count: countRegLinks } = await prisma.registrationLink.deleteMany();
    if (countRegLinks > 0) console.log(`Deleted ${countRegLinks} RegistrationLink(s)`);
    const { count: countPassLinks } = await prisma.resetPasswordLink.deleteMany();
    if (countPassLinks > 0) console.log(`Deleted ${countPassLinks} ResetPasswordLink(s)`);
  }

  if (bTrial || bAll) {
    const { count: countTrialIPs } = await prisma.trialRequestLimitIp.deleteMany();
    if (countTrialIPs > 0) console.log(`Deleted ${countTrialIPs} TrialRequestLimitIp(s)`);
    const { count: countTrialRequests } = await prisma.trialRequest.deleteMany();
    if (countTrialRequests > 0) console.log(`Deleted ${countTrialRequests} TrialRequest(s)`);
  }

  if (bAdmins || bAll) {
    const { count: countAdmins } = await prisma.userData.deleteMany({
      where: { admin: { isNot: null } },
    });
    if (countAdmins > 0) console.log(`Deleted ${countAdmins} Admin(s)`);
  }

  if (bCustomers || bAll) {
    const { count: countCustomers } = await prisma.userData.deleteMany({
      where: { customer: { isNot: null } },
    });
    if (countCustomers > 0) console.log(`Deleted ${countCustomers} Customer(s)`);
  }

  if (bUsers || bAll) {
    const { count: countUsers } = await prisma.userData.deleteMany({
      where: { user: { isNot: null } },
    });
    if (countUsers > 0) console.log(`Deleted ${countUsers} User(s)`);
  }

  if (bAuditLog || bAll) {
    const { count: countAuditLog } = await prisma.auditLog.deleteMany();
    if (countAuditLog > 0) console.log(`Deleted ${countAuditLog} AuditLog(s)`);
  }

  if (bStray) {
    const { count: countStray } = await prisma.userData.deleteMany({
      where: {
        admin: null,
        customer: null,
        user: null,
      },
    });
    if (countStray > 0) console.log(`Deleted ${countStray} Stray UserData(s)`);
  }

  if (bAll) {
    const { count: countCleanUpLog } = await prisma.cleanupLog.deleteMany();
    if (countCleanUpLog > 0) console.log(`Deleted ${countCleanUpLog} CleanupLog(s)`);
  }
};

truncate();
