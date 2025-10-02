import { notFound } from 'next/navigation';
import { AuditEvent } from '@prisma/client';
import db from '@/utils/server/db';
import loggedInCheck from '@/utils/server/logged-in-check';
import { createAuditLog } from '@/utils/server/audit';
// Components
import Footer from '@/components/admin/Footer';
// styles
import styles from './styles.module.scss';


// Function to check if an audit log exists for the payment intent
const checkExistingAuditLog = async paymentIntentId => {
  try {
    const existingLog = await db.auditLog.findFirst({
      where: {
        description: paymentIntentId,
      },
    });
    return !!existingLog; // Return true if a log exists, false otherwise
  } catch (error) {
    console.error('Error checking existing audit log:', error);
    throw error; // Or handle as needed
  }
};


const PaymentFailedPage = async ({ searchParams }) => {
  await loggedInCheck();

  const { scid: stripeCustomerId, payment_intent: description } = searchParams;

  try {
    const logExists = await checkExistingAuditLog(description);
    if (!logExists)
      await createAuditLog({
        type: AuditEvent.PAYMENT_FAILED_ADMINPAGE,
        stripeCustomerId,
        description, // Saving this in the AuditLog's description field, for uniqueness check
      });
  } catch (err) {
    console.error(err);
    notFound();
  }

  return (
    <main className={styles.main}>
      <div className={styles.info}>
        <div className={styles.title}>Payment Could Not Be Processed</div>
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
      </div>
      <Footer />
    </main>
  );
};


export default PaymentFailedPage;
