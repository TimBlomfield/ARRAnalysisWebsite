import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { authOptions } from '@/utils/server/auth';
import { getACU_Ids, isAuthTokenValid } from '@/utils/server/common';
// Styles
import styles from './styles.module.scss';


const SubscriptionsPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.token?.email == null)
    redirect('/login');

  const { token } = session;
  if (!isAuthTokenValid(token))
    redirect('/login');

  const acuIds = await getACU_Ids(token.email);
  if (acuIds?.customerId == null)
    notFound();

  return (
    <div className={styles.main}>
      <div className={styles.tempText}>Subscriptions Page</div>
    </div>
  );
};


export default SubscriptionsPage;
