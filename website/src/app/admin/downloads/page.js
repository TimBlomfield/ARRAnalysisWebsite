import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import axios from 'axios';
import { getACU_Ids, isAuthTokenValid } from '@/utils/server/common';
import { authOptions } from '@/utils/server/auth';
import { listFiles } from '@/utils/server/s3';
import db from '@/utils/server/db';
// Components
import DownloadFilesPage from '@/components/forms/DownloadFilesPage';


const DownloadsPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.token?.email == null)
    redirect('/login');

  const { token } = session;
  if (!isAuthTokenValid(token))
    redirect('/login');

  let acuIds, allowedDownloads;
  try {
    acuIds = await getACU_Ids(token.email);
    allowedDownloads = [false, false, false]; // Tier-1, Tier-2, Tier-3

    let products = null;
    if (acuIds.adminId == null && (acuIds.customerId != null || acuIds.userId != null)) {
      // Get the products
      const { data: prods } = await axios.get('https://saas.licensespring.com/api/v1/products/', {
        headers: {
          Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
        },
      });

      products = prods.results.map(prod => ({ id: prod.id, code: prod.short_code }));
    }

    // Allow downloads for customer licenses (purchased licenses)
    if (acuIds.adminId == null && acuIds.customerId != null) {
      const customer = await db.customer.findUnique({
        where: { id: acuIds.customerId },
        include: { userCustomer: true },
      });

      if (customer == null) throw new Error('Customer not found!');
      if (typeof customer.id_stripeCustomer !== 'string' || customer.id_stripeCustomer.length < 2) throw new Error('Invalid Stripe CustomerID encountered!');

      const { data: customerData } = await axios.get('https://saas.licensespring.com/api/v1/customers/', {
        headers: {
          Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
        },
        params: {
          reference: customer.id_stripeCustomer,
        },
      });

      if (customerData == null) throw new Error('Null fetch for customer');
      if (customerData.count !== 1) {
        if (customerData.count === 0) throw new Error('No customers found for the specified Stripe CustomerID');
        else if (customerData.count > 1) throw new Error('Multiple customers with the same Stripe CustomerID encountered!');
      }
      const licenseSpringCustomer = customerData.results[0];

      const { data: licenseData } = await axios.get('https://saas.licensespring.com/api/v1/licenses/', {
        headers: {
          Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
        },
        params: {
          customer_id: licenseSpringCustomer.id,
        },
      });

      // Allow download for all products that this customer has purchased a license for
      licenseData.results.forEach(license => {
        if (!license.status.toLowerCase().startsWith('disabled')) { // Don't allow disabled licenses, because they are probably from failed payments
          const foundProduct = products.find(prod => prod.id === license.product.id);
          if (foundProduct != null) {
            const { code } = foundProduct;
            if (code.endsWith('tier-1')) allowedDownloads[0] = true;
            else if (code.endsWith('tier-2')) allowedDownloads[1] = true;
            else if (code.endsWith('tier-3')) allowedDownloads[2] = true;
          }
        }
      });
    }

    // Allow downloads for user licenses (assigned licenses)
    if (acuIds.adminId == null && acuIds.userId != null) {
      const userData = await db.userData.findUnique({
        where: { email: token.email },
        include: { user: true },
      });
      for (const lid of userData.user.licenseIds) {
        const { data: licenseData } = await axios.get(`https://saas.licensespring.com/api/v1/licenses/${lid}`, {
          headers: {
            Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
          },
        });
        const licenseUsers = licenseData?.license_users || [];
        const user = licenseUsers.find(user => user.true_email === token.email);

        if (user != null) { // This means that the logged-in user is assigned to this license (not just allowed)
          const foundProduct = products.find(prod => prod.id === licenseData?.product?.id);
          if (foundProduct != null) {
            const { code } = foundProduct;
            if (code.endsWith('tier-1')) allowedDownloads[0] = true;
            else if (code.endsWith('tier-2')) allowedDownloads[1] = true;
            else if (code.endsWith('tier-3')) allowedDownloads[2] = true;
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
    notFound();
  }

  let files;
  try {
    files = await listFiles(`${process.env.CLOUDCUBE_TOP_FOLDER}${process.env.CLOUDCUBE_INSTALLS_FOLDER}`);
  } catch (err) {
    console.error('Error listing objects: ', err);
    notFound();
  }

  return <DownloadFilesPage files={files} isAdmin={acuIds.adminId != null} allowed={allowedDownloads} />;
};


export default DownloadsPage;
