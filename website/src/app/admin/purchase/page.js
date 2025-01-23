import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/server/auth';
import { isAuthTokenValid } from '@/utils/server/common';
import { getPricingTiers } from '@/utils/server/prices';
// Components
import PurchaseClientPage from '@/components/forms/PurchaseClientPage';


const PurchasePage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.token?.email == null)
    redirect('/login');

  const { token } = session;
  if (!isAuthTokenValid(token))
    redirect('/login');

  const tiers = await getPricingTiers();
  if (!tiers)
    notFound();

  return <PurchaseClientPage tiers={tiers} />;
};


export default PurchasePage;
