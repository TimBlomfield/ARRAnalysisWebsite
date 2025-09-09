import { AuditEvent } from '@prisma/client';
import db from '@/utils/server/db';
import { createAuditLog } from '@/utils/server/audit';
// Images
import ICircle from '@/../public/i.svg';
// Styles
import styles from './page.module.scss';
import Link from 'next/link';


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
    <div className={styles.main}>
      <div className={styles.contents}>
        <div className={styles.iconContainer}>
          <ICircle className={styles.i} />
        </div>
        <div className={styles.txtPaymentFailed}>
          Payment Could Not Be Processed
        </div>
        <div className={styles.txtIssue}>
          We encountered an issue while processing your payment. Don&apos;t worry, no charge was made to your account.
        </div>
        <div className={styles.errorDetails}>
          <div className={styles.txtErrorTitle}>What happened?</div>
          <div className={styles.txtErrorDetail}>
            Your payment was declined during processing. This could be due to insufficient funds, security restrictions, or a temporary issue with your payment method.
          </div>
        </div>
        <div className={styles.helpSection}>
            <div className={styles.txtHelpTitle}>Common Solutions</div>
          <ul className={styles.helpList}>
            <li>Check that your card details are entered correctly</li>
            <li>Ensure you have sufficient funds available</li>
            <li>Try a different payment method or card</li>
            <li>Contact your bank to authorize the transaction</li>
            <li>Check if your card supports online payments</li>
          </ul>
        </div>
        <div className={styles.txtHelp}>Need help? Check out our <Link href="/help-center">help center</Link> or <Link href="mailto:support-team@arr-analysis.com">send an e-mail</Link> to our support team.</div>
      </div>
    </div>
  );
};


export default PaymentFailedPage;
