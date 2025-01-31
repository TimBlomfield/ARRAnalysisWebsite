import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/server/auth';
import { isAuthTokenValid } from '@/utils/server/common';
import db from '@/utils/server/db';
// Components
import PurchaseSuccessClientPage from '@/components/forms/PurchaseSuccessClientPage';


const PurchaseSuccessPage = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);

  if (session?.token?.email == null)
    redirect('/login');

  const { token } = session;
  if (!isAuthTokenValid(token))
    redirect('/login');

  let N, period, tier;
  try {
    const purchaseInfo = JSON.parse(atob(searchParams.pi));
    N = purchaseInfo.licenses ?? 1;
    period = purchaseInfo.period === 0 ? 'monthly' : 'yearly';
    tier = purchaseInfo.tier + 1;

    const id_stripeCustomer = searchParams.scid;
    const theUserData = await db.userData.findUnique({
      where: { email: token.email },
      include: { customer: true },
    });

    if (theUserData != null) {
      if (theUserData.customer == null) {
        await db.customer.create({
          data: {
            id_stripeCustomer,
            id_UserData: theUserData.id,
          },
        });
      }
    }

    revalidatePath('/');
  } catch {
    notFound();
  }

  return <PurchaseSuccessClientPage N={N} period={period} tier={tier} />;
};


export default PurchaseSuccessPage;
