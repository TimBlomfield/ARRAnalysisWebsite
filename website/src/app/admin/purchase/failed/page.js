import { notFound } from 'next/navigation';
import { AuditEvent } from '@prisma/client';
import db from '@/utils/server/db';
import { createAuditLog } from '@/utils/server/audit';


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
    <div>
      Payment Failed
    </div>
  );
};


export default PaymentFailedPage;
