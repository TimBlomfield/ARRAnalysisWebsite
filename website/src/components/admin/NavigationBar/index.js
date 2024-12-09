import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/utils/server/auth';
import { isAuthTokenValid, getACU_Ids } from '@/utils/server/common';
// Components
import NavigationBarClient from '@/components/admin/NavigationBarClient';


const NavigationBar = async () => {
  const session = await getServerSession(authOptions);

  if (session?.token?.email == null)
    redirect('/login');

  const { token } = session;
  if (!isAuthTokenValid(token))
    redirect('/login');

  const acuIds = await getACU_Ids(token.email);
  if (acuIds == null)
    redirect('/login');

  const isCustomer = acuIds.customerId != null;
  const isUser = acuIds.userId != null;

  return <NavigationBarClient isCustomer={isCustomer} isUser={isUser} />;
};


export default NavigationBar;
