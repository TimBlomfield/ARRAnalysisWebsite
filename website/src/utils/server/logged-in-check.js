import 'server-only';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getACU_Ids, isAuthTokenValid } from '@/utils/server/common';
import { authOptions } from '@/utils/server/auth';


const CheckLoggedIn = async (nfAdmin = false,  nfUser = false, nfCustomer = false) => { // nfAdmin means: invoke notFound() if not admin
  const session = await getServerSession(authOptions);

  if (session?.token?.email == null)
    redirect('/login');

  const { token } = session;
  if (!isAuthTokenValid(token))
    redirect('/login');

  let acuIds = null;
  if (nfAdmin || nfUser || nfCustomer) {
    acuIds = await getACU_Ids(token.email);
    if (nfAdmin && acuIds?.adminId == null)
      notFound();
    if (nfUser && acuIds?.userId == null)
      notFound();
    if (nfCustomer && acuIds?.customerId == null)
      notFound();
  }

  return { token, acuIds };
};


export default CheckLoggedIn;
