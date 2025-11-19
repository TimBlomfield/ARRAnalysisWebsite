import { redirect } from 'next/navigation';
import { DateTime } from 'luxon';
import { TrialStatus } from '@prisma/client';
import db from '@/utils/server/db';
// Components
import DownloadTrialClientPage from '@/components/forms/DownloadTrialClientPage';


const TrialDownloadPage = async ({ searchParams }) => {
  const { token } = searchParams;

  const regLink = await db.trialRequest.findUnique({
    where: { token },
  });

  if (regLink == null)
    redirect('/trial?session=expired');
  if (regLink.status !== TrialStatus.EMAIL_VERIFIED)
    redirect(`/trial/register?token=${token}`);
  if (regLink.expiresAt < DateTime.now().toJSDate())
    redirect(`/trial/expired?email=${regLink.email}`);

  return <DownloadTrialClientPage token={token} password={regLink.licensePassword} email={regLink.email} />;
};


export default TrialDownloadPage;
