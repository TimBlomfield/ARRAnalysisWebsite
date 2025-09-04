import { DateTime } from 'luxon';
import Stripe from 'stripe';
import axios from 'axios';
import { AuditEvent } from '@prisma/client';
import db from '@/utils/server/db';
import { createAuditLog } from '@/utils/server/audit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const isDateWithinSixHours = dateString => {
  const date = DateTime.fromISO(dateString); // Parse the ISO date
  const now = DateTime.now(); // Current time
  const hoursDiff = now.diff(date, 'hours').hours; // Difference in hours

  return hoursDiff <= 6; // True if date is not older than 6 hours
};


const PaymentFailedPage = async ({ searchParams }) => {
  const { scid: id_stripeCustomer, secret, pi } = searchParams;

  // Data used for the Audit Log
  let bDB_UserDataDeleted = false, stripeCustomerDeleted = null, retDeleteCustomer = null, retDeleteLicenseUser = null, retDeleteOrder = null, tryError = null, email = null;
  const retDeleteLicenses = [];

  try {
    const theUserData = await db.userData.findFirst({ where: { secret }});

    if (theUserData != null) {  // Do the cleanup only if there's UserData with a secret
      email = theUserData.email;
      await db.userData.deleteMany({ where: { secret }});
      bDB_UserDataDeleted = true;

      stripeCustomerDeleted = await stripe.customers.del(id_stripeCustomer);

      const { data: customerData } = await axios.get('https://saas.licensespring.com/api/v1/customers/', {
        headers: {
          Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
        },
        params: {
          reference: id_stripeCustomer,
        },
      });

      const licenseSpring_Customer = customerData.count > 0 ? customerData.results[0] : null;

      if (licenseSpring_Customer != null) {
        const { data: licenseData } = await axios.get('https://saas.licensespring.com/api/v1/licenses/', {
          headers: {
            Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
          },
          params: {
            customer_id: licenseSpring_Customer.id,
          },
        });

        const { data: userData } = await axios.get('https://saas.licensespring.com/api/v1/license-users/', {
          headers: {
            Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
          },
          params: {
            true_email__iexact: licenseSpring_Customer.email,
          },
        });

        const licenseSpring_LicenseUser = userData.count > 0 ? userData.results[0] : null;
        const bLicenseUser_IsNotAnOldRecord = licenseSpring_LicenseUser != null && isDateWithinSixHours(licenseSpring_LicenseUser.created_at);

        const { data: orderData } = await axios.get('https://saas.licensespring.com/api/v1/orders/', {
          headers: {
            Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
          },
          params: {
            customer_id: licenseSpring_Customer.id,
          },
        });

        const licenseSpring_Order = orderData.count > 0 ? orderData.results[0] : null;
        const bOrder_IsNotAnOldRecord = licenseSpring_Order != null && isDateWithinSixHours(licenseSpring_Order.created_at);

        retDeleteCustomer = await axios.delete(`https://saas.licensespring.com/api/v1/customers/${licenseSpring_Customer.id}/`, {
          headers: {
            Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
          },
        });

        if (licenseData.count > 0) { // NOTE: Must delete Licenses before deleting Order!!! You cannot safe_delete an Order if it has a license associated with it
          for (const license of licenseData.results) {
            if (isDateWithinSixHours(license.created_at)) {
              const retDelete = await axios.delete(`https://saas.licensespring.com/api/v1/licenses/${license.id}`, {
                headers: {
                  Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
                },
              });
              retDeleteLicenses.push({ license: license.id, retDelete });
            } else {
              retDeleteLicenses.push({ license: license.id, retDelete: 'Not deleted because it is older than 6 hours' });
            }
          }
        }
        if (bOrder_IsNotAnOldRecord) { // NOTE: Must delete Order before deleting LicenseUser!!!
          retDeleteOrder = await axios.delete(`https://saas.licensespring.com/api/v1/orders/${licenseSpring_Order.id}/safe_delete/`, {
            headers: {
              Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
            },
          });
        }
        if (bLicenseUser_IsNotAnOldRecord) {
          retDeleteLicenseUser = await axios.delete(`https://saas.licensespring.com/api/v1/license-users/${licenseSpring_LicenseUser.id}/`, {
            headers: {
              Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
            },
          });
        }
      }
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
      const purchaseInfo = JSON.parse(atob(pi));
      const totalLicenses = purchaseInfo.licenses != null ? purchaseInfo.licenses : 1;
      const description = email != null && tryError === null && bDB_UserDataDeleted && stripeCustomerDeleted?.deleted
      && retDeleteCustomer?.status === 204 && retDeleteLicenses.map(lic => lic.retDelete?.status === 204).every(b => b === true)
      && retDeleteLicenses.length === totalLicenses && retDeleteOrder?.status === 204 && retDeleteLicenseUser?.status === 204
        ? 'Full cleanup successful'
        : 'Cleanup incomplete';


      const metadata = [
        {
          key: 'UserData',
          value: bDB_UserDataDeleted ? 'Deleted' : 'Not deleted',
        },
        {
          key: 'StripeCustomer',
          value: stripeCustomerDeleted?.deleted ? 'Deleted' : 'Not deleted',
        },
        {
          key: 'LicenseSpring_Customer',
          value: retDeleteCustomer?.status === 204 ? 'Deleted' : 'Not deleted',
        },
        {
          key: 'LicenseSpring_CountDeletedLicenses',
          value: retDeleteLicenses.filter(lic => lic.retDelete?.status === 204).length.toString(),
        },
        {
          key: 'LicenseSpring_CountTotalLicenses',
          value: retDeleteLicenses.length.toString(),
        },
        {
          key: 'LicenseSpring_Order',
          value: retDeleteOrder?.status === 204 ? 'Deleted' : 'Not deleted',
        },
        {
          key: 'LicenseSpring_User',
          value: retDeleteLicenseUser?.status === 204 ? 'Deleted' : 'Not deleted',
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
