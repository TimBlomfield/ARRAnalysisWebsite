import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/server/auth';
import { isAuthTokenValid } from '@/utils/server/common';


const LicensesPage = async req => {
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const session = await getServerSession(authOptions);

  if (session?.token?.email == null)
    redirect('/login');

  const { token } = session;
  if (!isAuthTokenValid(token))
    redirect('/login');

  if (token.userData.customerId == null)
    notFound();
  await delay(1000);

  return (
    <div>Licenses</div>
  );
};


export default LicensesPage;
