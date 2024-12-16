import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/server/auth';
import { isAuthTokenValid } from '@/utils/server/common';
import db from '@/utils/server/db';
// Components
import ProfileClientPage from '@/components/forms/ProfileClientPage';


const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.token?.email == null)
    redirect('/login');

  const { token } = session;
  if (!isAuthTokenValid(token))
    redirect('/login');

  const userData = await db.userData.findUnique({
    where: { email: token.email },
  });

  return <ProfileClientPage user={userData} />;
};


export default ProfilePage;
