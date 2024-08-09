import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/server/auth';
import { notFound } from 'next/navigation';
import SignOutButton from './sign-out-button';

const AdminPage = async () => {
  /*
  const session = await getServerSession(authOptions);
  console.log(session);

  if (!session?.user)
    notFound();
  */
  return (
    <>
      <div>This is the admin page</div>
      <SignOutButton />
    </>

  );
};


export default AdminPage;
