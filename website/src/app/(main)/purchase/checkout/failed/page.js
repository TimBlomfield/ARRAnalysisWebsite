import { AuditEvent } from '@prisma/client';
import db from '@/utils/server/db';
import { createAuditLog } from '@/utils/server/audit';


const PaymentFailedPage = async ({ searchParams }) => {
  const { scid: id_stripeCustomer, secret } = searchParams;

  // Data used for the Audit Log
  let bDB_UserDataDeleted = false, tryError = null, email = null;

  try {
    const theUserData = await db.userData.findFirst({ where: { secret }});

    if (theUserData != null) {  // Do the cleanup only if there's UserData with a secret
      email = theUserData.email;
      await db.userData.deleteMany({ where: { secret }});
      bDB_UserDataDeleted = true;
    }
  } catch (err) {
    console.error(err);
    tryError = {
      message: err.message || 'Unknown error',
      code: err.code || 'Unknown error code',
      type: err.type || 'Unknown error type',
      statusCode: err.statusCode || 'Unknown error status code',
      status: err.status || 'Unknown error status',
    };
    // Proceed to display the "Payment Failed" page even though the cleanup failed
  } finally {
    const bProbablyRefresh = tryError === null && email === null; // This is probably a page refresh, so don't audit log

    if (!bProbablyRefresh) {
      const description = bDB_UserDataDeleted
        ? 'UserData deleted'
        : 'An error occurred during the cleanup process';

      const metadata = [
        {
          key: 'UserDataDeleted',
          value: bDB_UserDataDeleted ? 'True' : 'False',
        },
        {
          key: 'StripeCustomerId',
          value: id_stripeCustomer,
        },
      ];

      if (tryError != null)
        metadata.push({
          key: 'Cleanup error',
          value: JSON.stringify(tryError),
        });

      await createAuditLog({
        type: AuditEvent.PAYMENT_FAILED_PAGE,
        secret,
        description,
        metadata,
      });
    }
  }

  return (
    <div>
      Payment Failed
    </div>
  );
};


export default PaymentFailedPage;
