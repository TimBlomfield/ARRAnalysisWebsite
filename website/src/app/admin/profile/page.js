import loggedInCheck from '@/utils/server/logged-in-check';
import db from '@/utils/server/db';
// Components
import ProfileClientPage from '@/components/forms/ProfileClientPage';


const ProfilePage = async () => {
  const { token } = await loggedInCheck();

  const userData = await db.userData.findUnique({
    where: { email: token.email },
  });

  return <ProfileClientPage user={userData} />;
};


export default ProfilePage;
