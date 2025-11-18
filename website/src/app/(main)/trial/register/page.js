import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { DateTime } from 'luxon';
import { TrialStatus } from '@prisma/client';
import db from '@/utils/server/db';
// Components
import RegisterTrialClientPage from '@/components/forms/RegisterTrialClientPage';


const TrialRegisterPage = async ({ searchParams }) => {
  const { token } = searchParams;

  const regLink = await db.trialRequest.findUnique({
    where: { token },
  });

  if (regLink == null || regLink.expiresAt < DateTime.now().toJSDate() || regLink.status !== TrialStatus.PENDING_VERIFICATION)
    redirect('/trial?session=expired');

  const headersList = headers();
  const country = headersList.get('sec-ch-geo-country')
    ?? headersList.get('x-vercel-ip-country')
    ?? 'US'; // fallback

  return (
    <RegisterTrialClientPage token={token} detectedCountry={country} />
  );
};


export default TrialRegisterPage;
