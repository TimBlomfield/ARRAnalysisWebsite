// NOTE: Next.js requires the usage of <Suspense>
import { notFound } from 'next/navigation';
import { getPricingTiers } from '@/utils/server/prices';
// Components
import CheckoutClientPage from '@/components/forms/CheckoutClientPage';


const CheckoutPage = async () => {
  const tiers = await getPricingTiers();
  if (!tiers)
    notFound();

  return <CheckoutClientPage tiers={tiers} />;
};


export default CheckoutPage;
