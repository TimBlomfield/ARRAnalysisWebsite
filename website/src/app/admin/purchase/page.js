import { notFound } from 'next/navigation';
import loggedInCheck from '@/utils/server/logged-in-check';
import { getPricingTiers } from '@/utils/server/prices';
// Components
import PurchaseClientPage from '@/components/forms/PurchaseClientPage';


const PurchasePage = async () => {
  await loggedInCheck();

  const tiers = await getPricingTiers();
  if (!tiers)
    notFound();

  return <PurchaseClientPage tiers={tiers} />;
};


export default PurchasePage;
